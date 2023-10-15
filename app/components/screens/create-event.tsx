import { zodResolver } from '@hookform/resolvers/zod';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { COLORS } from '../../constants/theme';
import Button from '../button';
import Header from '../header';
import { MontserratRegular } from '../text';
import ShieldPlus from '../../images/ShieldPlus.svg';
import { uploadImage } from '../../utils/metaplex/metadata';
import { createCandyMachine } from '../../utils/metaplex/core';
import useUmi from '../../hooks/use-umi';
import { publicKey } from '@metaplex-foundation/umi';
import { dateToTimestamp } from '../../utils/helpers/timestamp-to-date';
import { CandyMachineParams } from '../../utils/types';

enum Steps {
  FIRST,
  SECOND,
}

const firstStepSchema = z.object({
  eventName: z.string().min(1, { message: 'Required' }),
  ticketsAmount: z.string().min(1, { message: 'Required' }),
  startTime: z.string(),
  websiteLink: z.string().url({ message: 'Invalid link' }).optional(),
  salesStart: z.string(),
  ticketPrice: z.string(),
});

const secondStepSchema = z.object({
  treasuryAddress: z.string().min(1, { message: 'Required' }),
  allowedVisits: z.string(),
  eventImage: z.string(),
  eventBanner: z.string(),
});

export default function CreateEventScreen() {
  const umi = useUmi();
  const [step, setStep] = React.useState<Steps>(Steps.FIRST);
  const { control, handleSubmit, formState, setValue, trigger, getValues } =
    useForm<z.infer<typeof firstStepSchema & typeof secondStepSchema>>({
      resolver: zodResolver(
        step === Steps.FIRST ? firstStepSchema : secondStepSchema,
      ),
      shouldUnregister: false,
      mode: 'onChange',
    });
  const [formValues, setFormValues] =
    React.useState<z.infer<typeof firstStepSchema & typeof secondStepSchema>>();

  async function onFormSubmit(data) {
    try {
      const values = {
        ...formValues,
        ...data,
      };
      setFormValues(values);

      const candyMachineParams: CandyMachineParams = {
        itemsAvailable: Number(values.ticketsAmount),
        startDate: BigInt(dateToTimestamp(values.salesStart)),
        pricePerToken: Number(values.ticketPrice),
        treasury: publicKey(values.treasuryAddress),
        metadata: {
          name: values.eventName,
          description: '',
          image: values.eventImage,
          animation_url: '',
          external_url: values.websiteLink ?? '',
          attributes: [
            {
              trait_type: 'start_time',
              value: dateToTimestamp(values.startTime).toString(),
            },
            {
              trait_type: 'candy_machine',
              value: '',
            },
          ],
          properties: {
            files: [
              {
                uri: values.eventBanner,
                type: 'image/jpg',
                cdn: false,
              },
            ],
            category: 'banner',
          },
        },
      };
      const eventPublicKey = await createCandyMachine(umi, candyMachineParams);
      await fetch('https://available-events-api.onrender.com/event', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: eventPublicKey,
        }),
      });
    } catch (error) {
      console.error('onFormSubmit', error);
    }
  }

  const returnToPreviousStep = () => {
    setStep(Steps.FIRST);
  };

  const handleNext = async () => {
    const isStepValid = await trigger();

    if (!isStepValid) {
      return;
    }

    setFormValues(prev => ({
      ...prev,
      ...getValues(),
    }));
    setStep(Steps.SECOND);
  };

  // TODO: Handle back swipe to return to the previous step

  const showDatepicker = (
    currentMode: 'date' | 'time',
    onChange: (event: DateTimePickerEvent, date?: Date | undefined) => void,
  ) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  return (
    <ScrollView style={s.container} stickyHeaderIndices={[0]}>
      <Header
        title="Create event"
        backButtonOnPress={
          step === Steps.FIRST ? undefined : returnToPreviousStep
        }
      />

      <View style={s.content}>
        {step === Steps.FIRST && (
          <View style={s.form}>
            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>Name</MontserratRegular>
                  <TextInput
                    style={[s.textInput, error && s.error]}
                    placeholderTextColor={COLORS.greyB}
                    placeholder="Event Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="eventName"
            />

            <View style={s.formRow}>
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={s.formControl}>
                    <MontserratRegular style={s.label}>
                      Tickets amount
                    </MontserratRegular>
                    <TextInput
                      style={[s.textInput, error && s.error]}
                      placeholderTextColor={COLORS.greyB}
                      placeholder="999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />

                    {error && (
                      <MontserratRegular style={s.errorText}>
                        {error.message}
                      </MontserratRegular>
                    )}
                  </View>
                )}
                name="ticketsAmount"
              />
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={s.formControl}>
                    <MontserratRegular style={s.label}>
                      Start time
                    </MontserratRegular>
                    <Pressable
                      onPress={() =>
                        showDatepicker('date', (_, date) =>
                          date
                            ? setValue(
                                'startTime',
                                date.toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                }),
                                { shouldValidate: true },
                              )
                            : undefined,
                        )
                      }>
                      <TextInput
                        style={[s.textInput, error && s.error]}
                        placeholderTextColor={COLORS.greyB}
                        placeholder="09/01/2024"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        editable={false}
                      />
                    </Pressable>

                    {error && (
                      <MontserratRegular style={s.errorText}>
                        {error.message}
                      </MontserratRegular>
                    )}
                  </View>
                )}
                name="startTime"
              />
            </View>

            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>
                    Event website link
                  </MontserratRegular>
                  <TextInput
                    style={[s.textInput, error && s.error]}
                    placeholderTextColor={COLORS.greyB}
                    placeholder="https://example.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="websiteLink"
            />

            <View style={s.formRow}>
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={s.formControl}>
                    <MontserratRegular style={s.label}>
                      Sales start
                    </MontserratRegular>
                    <Pressable
                      onPress={() =>
                        showDatepicker('date', (_, date) =>
                          date
                            ? setValue(
                                'salesStart',
                                date.toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                }),
                                { shouldValidate: true },
                              )
                            : undefined,
                        )
                      }>
                      <TextInput
                        style={[s.textInput, error && s.error]}
                        placeholderTextColor={COLORS.greyB}
                        placeholder="09/01/2024"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        editable={false}
                      />
                    </Pressable>

                    {error && (
                      <MontserratRegular style={s.errorText}>
                        {error.message}
                      </MontserratRegular>
                    )}
                  </View>
                )}
                name="salesStart"
              />
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={s.formControl}>
                    <MontserratRegular style={s.label}>
                      Ticket price
                    </MontserratRegular>
                    <TextInput
                      style={[s.textInput, error && s.error]}
                      placeholderTextColor={COLORS.greyB}
                      placeholder="100"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />

                    {error && (
                      <MontserratRegular style={s.errorText}>
                        {error.message}
                      </MontserratRegular>
                    )}
                  </View>
                )}
                name="ticketPrice"
              />
            </View>

            <Button style={s.button} onPress={handleNext}>
              Continue
            </Button>
          </View>
        )}

        {step === Steps.SECOND && (
          <View style={s.form}>
            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>
                    Destination address
                  </MontserratRegular>
                  <TextInput
                    style={[s.textInput, error && s.error]}
                    placeholderTextColor={COLORS.greyB}
                    placeholder="Treasury destination address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="treasuryAddress"
            />

            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>
                    Allowed visits
                  </MontserratRegular>
                  <TextInput
                    style={[s.textInput, error && s.error]}
                    placeholderTextColor={COLORS.greyB}
                    placeholder="Number of allowed visits"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="allowedVisits"
            />

            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>
                    Event image
                  </MontserratRegular>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TextInput
                      style={[s.textInput, error && s.error, { flex: 1 }]}
                      placeholderTextColor={COLORS.greyB}
                      placeholder="Event image"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={s.uploadButton}
                      onPress={async () => {
                        const uri = await uploadImage();

                        if (!uri) {
                          ToastAndroid.show(
                            'Error uploading image',
                            ToastAndroid.SHORT,
                          );
                          return;
                        }

                        setValue('eventImage', uri, { shouldValidate: true });
                      }}>
                      <ShieldPlus width={24} height={24} />
                    </TouchableOpacity>
                  </View>

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="eventImage"
            />

            <Controller
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View>
                  <MontserratRegular style={s.label}>
                    Event banner
                  </MontserratRegular>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TextInput
                      style={[s.textInput, error && s.error, { flex: 1 }]}
                      placeholderTextColor={COLORS.greyB}
                      placeholder="Event banner"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={s.uploadButton}
                      onPress={async () => {
                        const uri = await uploadImage();

                        if (!uri) {
                          ToastAndroid.show(
                            'Error uploading image',
                            ToastAndroid.SHORT,
                          );
                          return;
                        }

                        setValue('eventBanner', uri, { shouldValidate: true });
                      }}>
                      <ShieldPlus width={24} height={24} />
                    </TouchableOpacity>
                  </View>

                  {error && (
                    <MontserratRegular style={s.errorText}>
                      {error.message}
                    </MontserratRegular>
                  )}
                </View>
              )}
              name="eventBanner"
            />

            <Button style={s.button} onPress={handleSubmit(onFormSubmit)}>
              Create event
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  form: {
    gap: 20,
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  formControl: {
    flex: 1,
  },
  label: {
    color: COLORS.greyA,
    fontSize: 16,
    letterSpacing: -0.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  textInput: {
    color: COLORS.black,
    backgroundColor: COLORS.greyC,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  error: {
    color: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 12,
    fontSize: 14,
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  uploadButton: {
    padding: 12,
    backgroundColor: COLORS.black,
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 32,
  },
});
