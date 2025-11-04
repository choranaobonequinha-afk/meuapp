import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
// Unify logo usage across screens (use hero image)

const { width } = Dimensions.get('window');

const videoCategories = [
  { id: 'todos', name: 'Todos', icon: '🎬', color: '#4F46E5' },
  { id: 'matematica', name: 'Matemática', icon: '📐', color: '#3B82F6' },
  { id: 'portugues', name: 'Português', icon: '📚', color: '#8B5CF6' },
  { id: 'historia', name: 'História', icon: '🏛️', color: '#3B82F6' },
  { id: 'geografia', name: 'Geografia', icon: '🌍', color: '#10B981' },
  { id: 'fisica', name: 'Física', icon: '⚡', color: '#EF4444' },
  { id: 'quimica', name: 'Química', icon: '🧪', color: '#8B5CF6' },
];

const featuredVideos = [
  {
    id: 1,
    title: 'Funções do 1º Grau - Matemática ENEM',
    channel: 'Matemática Rio',
    views: '2.1M',
    duration: '15:32',
    thumbnail: 'https://via.placeholder.com/300x180/4F46E5/FFFFFF?text=Matemática',
    subject: 'matematica',
    rating: 4.8,
    watched: false
  },
  {
    id: 2,
    title: 'Interpretação de Texto - Dicas para ENEM',
    channel: 'Professor Noslen',
    views: '1.8M',
    duration: '12:45',
    thumbnail: 'https://via.placeholder.com/300x180/8B5CF6/FFFFFF?text=Português',
    subject: 'portugues',
    rating: 4.9,
    watched: false
  },
  {
    id: 3,
    title: 'História do Brasil - Independência',
    channel: 'História Online',
    views: '956K',
    duration: '18:20',
    thumbnail: 'https://via.placeholder.com/300x180/3B82F6/FFFFFF?text=História',
    subject: 'historia',
    rating: 4.7,
    watched: true
  }
];

const subjectVideos = {
  matematica: [
    {
      id: 4,
      title: 'Álgebra Linear - Conceitos Básicos',
      channel: 'Matemática Rio',
      views: '450K',
      duration: '22:15',
      thumbnail: 'https://via.placeholder.com/300x180/F59E0B/FFFFFF?text=Álgebra',
      rating: 4.6,
      watched: false
    },
    {
      id: 5,
      title: 'Geometria Analítica - ENEM',
      channel: 'Matemática Rio',
      views: '320K',
      duration: '19:30',
      thumbnail: 'https://via.placeholder.com/300x180/F59E0B/FFFFFF?text=Geometria',
      rating: 4.5,
      watched: false
    }
  ],
  portugues: [
    {
      id: 6,
      title: 'Gramática - Classes de Palavras',
      channel: 'Professor Noslen',
      views: '280K',
      duration: '16:45',
      thumbnail: 'https://via.placeholder.com/300x180/8B5CF6/FFFFFF?text=Gramática',
      rating: 4.8,
      watched: false
    },
    {
      id: 7,
      title: 'Literatura - Modernismo',
      channel: 'Professor Noslen',
      views: '195K',
      duration: '14:20',
      thumbnail: 'https://via.placeholder.com/300x180/8B5CF6/FFFFFF?text=Literatura',
      rating: 4.7,
      watched: false
    }
  ]
};

const recommendedChannels = [
  {
    id: 1,
    name: 'Matemática Rio',
    subscribers: '2.1M',
    avatar: 'https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=MR',
    subject: 'Matemática',
    videos: 450
  },
  {
    id: 2,
    name: 'Professor Noslen',
    subscribers: '1.8M',
    avatar: 'https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=PN',
    subject: 'Português',
    videos: 320
  },
  {
    id: 3,
    name: 'História Online',
    subscribers: '956K',
    avatar: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=HO',
    subject: 'História',
    videos: 280
  }
];

export default function VideosScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const catScrollRef = useRef<ScrollView | null>(null);
  const [catX, setCatX] = useState(0);

  const getVideosToShow = () => {
    if (selectedCategory === 'todos') {
      return [...featuredVideos, ...Object.values(subjectVideos).flat()];
    }
    return subjectVideos[selectedCategory as keyof typeof subjectVideos] || [];
  };

  const formatViews = (views: string) => {
    const num = parseInt(views.replace('K', '000').replace('M', '000000'));
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/hero-logo.png')}
                style={styles.heroLogo}
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Vídeos Educativos</Text>
              <Text style={styles.subtitle}>Aprenda com os melhores</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={{ paddingRight: 20 }}
              ref={catScrollRef}
              onScroll={(e) => setCatX(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={16}
            >
              {videoCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && { backgroundColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.categoryNameSelected
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {Platform.OS === 'web' && (
              <View style={styles.catArrows} pointerEvents="box-none">
                <TouchableOpacity
                  style={[styles.catArrowBtn, { left: 0, opacity: catX <= 0 ? 0.3 : 1 }]}
                  onPress={() => {
                    const step = Math.round(width * 0.6);
                    const next = Math.max(0, catX - step);
                    catScrollRef.current?.scrollTo({ x: next, animated: true });
                  }}
                >
                  <Ionicons name="chevron-back" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.catArrowBtn, { right: 0 }]}
                  onPress={() => {
                    const step = Math.round(width * 0.6);
                    const next = catX + step;
                    catScrollRef.current?.scrollTo({ x: next, animated: true });
                  }}
                >
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            </View>
          </View>

          {/* Featured Videos */}
          {selectedCategory === 'todos' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vídeos em Destaque</Text>
              <View style={styles.featuredGrid}>
                {featuredVideos.map((video) => (
                  <TouchableOpacity key={video.id} style={styles.videoCard}>
                    <View style={styles.thumbnailContainer}>
                      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                      <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{video.duration}</Text>
                      </View>
                      {video.watched && (
                        <View style={styles.watchedBadge}>
                          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        </View>
                      )}
                    </View>
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <Text style={styles.channelName}>{video.channel}</Text>
                      <View style={styles.videoStats}>
                        <Text style={styles.viewsText}>{formatViews(video.views)} visualizações</Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#F59E0B" />
                          <Text style={styles.ratingText}>{video.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Subject Videos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'todos' ? 'Vídeos por Matéria' : `Vídeos de ${videoCategories.find(c => c.id === selectedCategory)?.name}`}
            </Text>
            <View style={styles.videosGrid}>
              {getVideosToShow().map((video) => (
                <TouchableOpacity key={video.id} style={styles.videoCard}>
                  <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    {video.watched && (
                      <View style={styles.watchedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      </View>
                    )}
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.channelName}>{video.channel}</Text>
                    <View style={styles.videoStats}>
                      <Text style={styles.viewsText}>{formatViews(video.views)} visualizações</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>{video.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recommended Channels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Canais Recomendados</Text>
            <View style={styles.channelsList}>
              {recommendedChannels.map((channel) => (
                <TouchableOpacity key={channel.id} style={styles.channelCard}>
                  <Image source={{ uri: channel.avatar }} style={styles.channelAvatar} />
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelName}>{channel.name}</Text>
                    <Text style={styles.channelSubject}>{channel.subject}</Text>
                    <Text style={styles.channelStats}>
                      {channel.subscribers} inscritos • {channel.videos} vídeos
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.subscribeText}>Inscrever</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Study Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dicas de Estudo</Text>
            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <Ionicons name="play-circle-outline" size={24} color="#10B981" />
                <Text style={styles.tipText}>
                  Assista vídeos em velocidade 1.5x para economizar tempo
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bookmark-outline" size={24} color="#3B82F6" />
                <Text style={styles.tipText}>
                  Salve vídeos importantes para revisar depois
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="pause-outline" size={24} color="#F59E0B" />
                <Text style={styles.tipText}>
                  Faça pausas para anotar pontos importantes
                </Text>
              </View>
            </View>
    </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  logoContainer: {
    alignItems: 'center',
  },
  heroLogo: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  hexagon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    transform: [{ rotate: '-30deg' }],
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  catArrows: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -14,
    height: 0,
  },
  catArrowBtn: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  categoryNameSelected: {
    color: 'white',
  },
  featuredGrid: {
    gap: 16,
  },
  videosGrid: {
    gap: 16,
  },
  videoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  watchedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 2,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    lineHeight: 22,
  },
  channelName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  channelsList: {
    gap: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  channelAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  channelInfo: {
    flex: 1,
  },
  channelSubject: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  channelStats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  subscribeButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: 20,
  },
});
