import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import { Event } from '@/src/services/events.service'

interface EventCardProps {
  event: Event
  onPress?: () => void
}

export function EventCard({ event, onPress }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const CardContent = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(event.startAt)}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Início: </Text>
          <Text style={styles.timeText}>{formatTime(event.startAt)}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Término: </Text>
          <Text style={styles.timeText}>{formatTime(event.endAt)}</Text>
        </View>
      </View>

      {event.eventCategories && event.eventCategories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {event.eventCategories.map((eventCategory) => (
            <View key={eventCategory.id} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{eventCategory.category.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    )
  }

  return <CardContent />
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.black200,
    flex: 1,
    marginRight: 8,
  },
  dateContainer: {
    backgroundColor: colors.green100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.green300,
    fontFamily: 'Poppins_600SemiBold',
  },
  description: {
    fontSize: 14,
    color: colors.gray200,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: colors.gray200,
  },
  timeText: {
    fontSize: 12,
    color: colors.black200,
    fontFamily: 'Poppins_600SemiBold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: colors.green300,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
})
