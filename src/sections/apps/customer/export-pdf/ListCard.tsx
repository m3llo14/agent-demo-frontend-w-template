// third-party
import { Page, View, Document, StyleSheet, Image as ImageIcon, Text } from '@react-pdf/renderer';

// types
import { CustomerList } from 'types/customer';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    flexDirection: 'column',
    '@media max-width: 400': {
      flexDirection: 'column'
    }
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    objectFit: 'cover'
  },
  CardInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
    lineHeight: 1.57,
    color: textPrimary
  },
  role: {
    fontSize: 10,
    lineHeight: 1.66,
    color: textSecondary
  },
  hr: {
    borderBottom: `1px solid ${border}`,
    marginTop: 10,
    marginBottom: 10
  },
  card: {
    border: `1px solid ${border}`,
    marginBottom: '15px'
  },
  cardTitle: {
    fontSize: '12px',
    borderBottom: `1px solid ${border}`,
    padding: 15
  },
  cardContent: {
    padding: 15
  },
  about: {
    padding: 15,
    fontSize: '11px',
    color: textPrimary
  },
  IconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  IconRow: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5
  },
  icon: {
    width: 12,
    height: 10
  },
  iconTitle: {
    fontSize: 10,
    color: textPrimary
  },
  mainTitle: {
    fontSize: '11px',
    color: textSecondary
  },
  chip: {
    border: `1px solid ${textSecondary}`,
    alignItems: 'center',
    borderRadius: '4px',
    marginRight: 4,
    marginBottom: 8
  },
  chipTitle: {
    color: textSecondary,
    fontSize: '10px',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 4,
    paddingTop: 4
  },
  leftColumn: {
    paddingTop: '10px',
    width: '75%'
  },
  rightColumn: {
    paddingTop: '10px',
    width: '25%'
  },
  infoCard: {
    padding: 10
  },
  userDetails: {
    rowGap: 5,
    marginBottom: 15
  }
});

const avatarImage = '/assets/images/users';

// ==============================|| CUSTOMER - PREVIEW ||============================== //

interface Props {
  customer: CustomerList;
}

export default function ListCard({ customer }: Props) {
  return (
    <Document title={`${customer?.name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.row}>
            <ImageIcon style={styles.image} src={`${avatarImage}/avatar-${!customer.avatar ? 1 : customer.avatar}.png`} />
            <View style={styles.CardInfo}>
              <Text style={styles.title}>{customer.name}</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Info</Text>
            <View style={styles.cardContent}>
              <View style={styles.userDetails}>
                <Text style={styles.mainTitle}>Email</Text>
                <Text style={styles.iconTitle}>{customer.email}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.mainTitle}>Contact</Text>
                <Text style={styles.iconTitle}>{customer.contact}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.mainTitle}>Age</Text>
                <Text style={styles.iconTitle}>{String(customer.age)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
