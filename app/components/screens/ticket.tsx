import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { COLORS } from '../../constants/theme';
import ArrowLeft from '../../images/AltArrowLeft.svg';
import ArrowRightUp from '../../images/ArrowRightUp.svg';
import { RootStackScreenProps } from '../../types/navigation';
import Button from '../button';
import FlipCard, { FlipSide } from '../flip-card';
import { MontserratMedium, MontserratSemiBold } from '../text';
import useUmi from '../../hooks/use-umi';
import { fetchMetadataByMint } from '../../utils/metaplex/nft-retrieval';
import { timestampToDate } from '../../utils/helpers/timestamp-to-date';

export default function TicketScreen({
  route,
}: RootStackScreenProps<'Ticket'>) {
  const event = route.params;
  console.log(event);
  const insets = useSafeAreaInsets();
  const [cardSide, setCardSide] = useState<FlipSide>(FlipSide.BACK);

  const umi = useUmi();
  const [ticket, setTicket] = useState<{
    id: string;
    image: string;
    expiryDate: string;
    type: string;
  }>();

  useEffect(() => {
    async function getTicket() {
      try {
        const ticket = await fetchMetadataByMint(umi, event.ticket.publicKey);
        if (!ticket) return;

        setTicket({
          id: ticket.name,
          expiryDate: timestampToDate(
            Number(ticket.attributes?.[0]?.value) ?? 0,
          ),
          type: ticket.attributes?.[1]?.value ?? '',
          image: ticket.image,
        });
      } catch (error) {
        console.error('Error fetching my tickets:', error);
      }
    }
    getTicket();
  }, []);

  console.log('cardSide', cardSide);

  const FrontSide = (
    <LinearGradient
      colors={['#181C1F', '#0F1012']}
      angle={151}
      locations={[0.15, 1]}
      style={[s.cardBackground]}>
      <FastImage
        style={[StyleSheet.absoluteFill, s.cardBackground]}
        source={require('../../images/CardBackground.png')}>
        <View style={s.cardHeader}>
          <View style={s.cardHeaderBlock}>
            <MontserratMedium style={s.cardHeaderText}>
              Expiry Date
            </MontserratMedium>
            <MontserratMedium style={s.cardHeaderText}>
              {ticket?.expiryDate}
            </MontserratMedium>
          </View>
          <View style={s.cardHeaderBlock}>
            <MontserratMedium style={s.cardHeaderText}>Ticket</MontserratMedium>
            <MontserratMedium style={s.cardHeaderText}>
              {ticket?.id}
            </MontserratMedium>
          </View>
        </View>
        <View style={s.cardBody}>
          <FastImage style={s.cardBodyImage} source={{ uri: ticket?.image }} />
          <MontserratSemiBold style={s.cardBodyTitle}>
            {event.title}
          </MontserratSemiBold>
          <MontserratMedium style={s.cardBodyType}>VIP</MontserratMedium>
        </View>
      </FastImage>
    </LinearGradient>
  );

  const BackSide = (
    <LinearGradient
      colors={['#181C1F', '#0F1012']}
      angle={151}
      locations={[0.15, 1]}
      style={s.cardBackground}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MontserratMedium style={s.cardBodyWatermark}>
          This is {event.title} Ticket {ticket?.id} purchased on NFTickets
          platform
        </MontserratMedium>
        <View style={s.cardBodyQrCodeWrapper}>
          <QRCode size={160} value={event.link} />
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <ScrollView style={s.container}>
      <View style={[s.header, , { paddingTop: insets.top + 8 }]}>
        <Shadow distance={4} style={s.backButton}>
          <ArrowLeft width={24} height={24} />
        </Shadow>
      </View>
      <View style={s.content}>
        <Shadow distance={4} style={s.topCard}>
          <FastImage style={s.topCardImage} source={{ uri: event.image }} />
          <View>
            <MontserratMedium style={s.topCardTitle}>
              {event.title}
            </MontserratMedium>
            <MontserratMedium style={s.topCardDate}>
              {timestampToDate(event.timestamp)}
            </MontserratMedium>
          </View>
          <Pressable style={s.topCardArrow}>
            <ArrowRightUp width={32} height={32} />
          </Pressable>
        </Shadow>
        <FlipCard
          side={cardSide}
          front={FrontSide}
          back={BackSide}
          style={s.card}
        />
        <MontserratMedium style={s.hint}>Tap to rotate</MontserratMedium>
        <Button
          style={s.buyButton}
          onPress={() =>
            setCardSide(prev =>
              prev === FlipSide.BACK ? FlipSide.FRONT : FlipSide.BACK,
            )
          }>
          Buy for 55.99 SOL
        </Button>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  topCard: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCardImage: {
    width: 64,
    height: 64,
    borderRadius: 64,
    marginRight: 16,
  },
  topCardTitle: {
    color: COLORS.black,
    fontSize: 16,
  },
  topCardDate: {
    color: COLORS.greyA,
    fontSize: 16,
  },
  topCardArrow: {
    marginLeft: 'auto',
  },
  card: {
    width: '100%',
    height: 430,
    position: 'relative',
    borderRadius: 16,
    marginTop: 24,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
  },
  cardHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
  },
  cardHeaderBlock: {
    gap: 8,
  },
  cardHeaderText: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#fff',
  },
  cardBody: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: [{ translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardBodyImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 24,
  },
  cardBodyTitle: {
    fontSize: 18,
    textTransform: 'uppercase',
    color: '#fff',
    marginBottom: 8,
  },
  cardBodyType: {
    fontSize: 16,
    color: '#fff',
  },
  cardBodyWatermark: {
    color: COLORS.greyB,
    fontSize: 14,
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  cardBodyQrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  hint: {
    color: COLORS.greyA,
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: 8,
    textAlign: 'center',
  },
  buyButton: {
    marginTop: 24,
    width: '100%',
  },
});
