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
import { uploadImage } from '../../utils/metaplex/metadata';
import ShieldPlus from '../../images/ShieldPlus.svg';
import { PublicKey } from '@metaplex-foundation/umi';
import {
  CreateEventParamList,
  CreateEventScreenProps,
} from '../../types/navigation';
import { insertNfts } from '../../utils/metaplex/core';
import useUmi from '../../hooks/use-umi';
import { TicketMetadata } from '../../utils/types';
import {
  fetchCandyMachineByEvent,
  fetchMetadataByMint,
} from '../../utils/metaplex/nft-retrieval';
import { dateToTimestamp } from '../../utils/helpers/timestamp-to-date';

const TicketTypes = z.enum(['Standard', 'VIP', 'Student']);

const formSchema = z.object({
  ticketImage: z.string(),
  expiryDate: z.string(),
  ticketType: TicketTypes,
  copies: z.string(),
});

export default function CreateTicketScreen(
  props: CreateEventScreenProps<'Create Ticket'>,
) {
  const umi = useUmi();
  const { eventPublicKey } = props.route.params;

  const { control, handleSubmit, setValue, getValues } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  async function onSubmit(data) {
    try {
      console.log(data);
      const eventMetadata = await fetchMetadataByMint(umi, eventPublicKey);
      const candyMachine = await fetchCandyMachineByEvent(umi, eventPublicKey);

      const nft: TicketMetadata = {
        name: candyMachine.itemsLoaded.toString(),
        description: '',
        image: data.ticketImage,
        animation_url: '',
        external_url: eventMetadata.external_url,
        attributes: [
          {
            trait_type: 'expiry_time',
            value: dateToTimestamp(data.expiryDate).toString(),
          },
          {
            trait_type: 'ticket_type',
            value: data.ticketType,
          },
          {
            trait_type: 'allowed_visits',
            value: data.allowedVisits,
          },
          {
            trait_type: 'visits',
            value: '0',
          },
        ],
        properties: {
          files: [],
          category: '',
        },
      };

      await insertNfts(
        umi,
        candyMachine.publicKey,
        Array(data.copies).fill(nft),
      );
    } catch (error) {
      console.error('onSubmit', error);
    }
  }

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

  const renderToggleGroup = () => {
    const ticketTypes = Object.values(TicketTypes.Values);

    return ticketTypes.map(element => {
      const currentlySelected = getValues('ticketType');
      const isSelected = element === currentlySelected;

      const onPress = () => {
        setValue('ticketType', element, { shouldValidate: true });
      };

      return (
        <Pressable
          style={[s.ticketTypeButton, isSelected && s.selected]}
          onPress={onPress}
          disabled={isSelected}
          key={element}>
          <MontserratRegular
            style={[s.ticketTypeText, isSelected && s.selectedText]}>
            {element}
          </MontserratRegular>
        </Pressable>
      );
    });
  };

  return (
    <ScrollView style={s.container} stickyHeaderIndices={[0]}>
      <Header title="Create a ticket" />

      <View style={s.content}>
        <View style={s.form}>
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <MontserratRegular style={s.label}>
                  Ticket image
                </MontserratRegular>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TextInput
                    style={[s.textInput, error && s.error, { flex: 1 }]}
                    placeholderTextColor={COLORS.greyB}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={false}
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

                      setValue('ticketImage', uri, { shouldValidate: true });
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
            name="ticketImage"
          />

          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={s.formControl}>
                <MontserratRegular style={s.label}>
                  Expiry date
                </MontserratRegular>
                <Pressable
                  onPress={() => {
                    showDatepicker('date', (_, date) =>
                      date
                        ? setValue(
                            'expiryDate',
                            date.toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            }),
                            { shouldValidate: true },
                          )
                        : undefined,
                    );
                  }}>
                  <TextInput
                    style={[s.textInput, error && s.error]}
                    placeholderTextColor={COLORS.greyB}
                    placeholder="9/01/2024"
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
            name="expiryDate"
          />

          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <MontserratRegular style={s.label}>
                  Ticket type
                </MontserratRegular>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {renderToggleGroup()}
                </View>

                {error && (
                  <MontserratRegular style={s.errorText}>
                    {error.message}
                  </MontserratRegular>
                )}
              </View>
            )}
            name="ticketType"
          />

          <View style={s.separator} />

          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={s.formControl}>
                <MontserratRegular style={s.label}>
                  Ticket copies
                </MontserratRegular>
                <TextInput
                  style={[s.textInput, error && s.error]}
                  placeholderTextColor={COLORS.greyB}
                  placeholder="1"
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

                <MontserratRegular
                  style={[s.label, { color: COLORS.greyB, marginTop: 12 }]}>
                  This will mint the desired number of tickets in one
                  transaction.
                </MontserratRegular>
              </View>
            )}
            name="copies"
          />

          <Button style={s.button} onPress={handleSubmit(onSubmit)}>
            Create ticket(s)
          </Button>
        </View>
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
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyC,
  },
  ticketTypeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.greyC,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: COLORS.black,
  },
  ticketTypeText: {
    fontSize: 16,
    letterSpacing: -0.5,
    lineHeight: 20,
    color: COLORS.greyB,
  },
  selectedText: {
    color: '#fff',
  },
});
