import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../store/themeStore';

const { width, height } = Dimensions.get('window');
const SPLASH_LOGO_SIZE = Math.min(width, height) * 0.56;
const HERO_LOGO_SIZE = Math.min(width, height) * 0.36;
const SPLASH_LOGO_X_NUDGE = 10; // pixels to the right to visually center the artwork

const onboardingData = [
  {
    title: 'Estudar nunca foi tão fácil!',
    description: 'Aprenda com interatividade, praticidade e foco no que realmente importa.',
    color: '#4F46E5',
  },
  {
    title: 'Aprenda mais de graça!',
    description: 'Explicações claras e atividades interativas para turbinar seus estudos onde estiver!',
    color: '#3B82F6',
  },
  {
    title: 'Estude mais rápido e com eficiência',
    description: 'Testes rápidos e explicações diretas pra você dominar os conteúdos no seu ritmo.',
    color: '#8B5CF6',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(width - 48); // fallback until measured
  const [showSplash, setShowSplash] = useState(true);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(10)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const isDraggingRef = useRef(false);

  // Autoplay: every 4s, loop slides and scroll
  useEffect(() => {
    const id = setInterval(() => {
      if (isDraggingRef.current || pageWidth <= 0) return; // pause while dragging or not measured
      setCurrentIndex((i) => {
        const next = (i + 1) % onboardingData.length;
        scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [pageWidth]);

  // Animated intro splash (scale-in logo, reveal title, then fade out)
  useEffect(() => {
    // sequence: logo in -> title in -> small hold -> fade overlay
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(650),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 420,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setShowSplash(false));
  }, []);

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showSplash && (
        <Animated.View style={[styles.splashOverlay, { opacity: overlayOpacity }]}>
          <Animated.Image
            source={require('../assets/images/splash-logo.png')}
            style={{
              width: SPLASH_LOGO_SIZE,
              height: SPLASH_LOGO_SIZE,
              resizeMode: 'contain',
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateX: SPLASH_LOGO_X_NUDGE }],
            }}
          />
          <Animated.Text
            style={[
              styles.splashTitle,
              { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] },
            ]}
          >
            APRENDER +
          </Animated.Text>
        </Animated.View>
      )}
      <SafeAreaView style={styles.container}>
        {/* Top Section - Logo */}
        <View style={styles.topSection}>
          {/* Decorative dots moved to background layer */}
          <View pointerEvents="none" style={styles.decorationLayer}>
            <View style={[styles.decorationDot, { top: 100, left: 50 }]} />
            <View style={[styles.decorationDot, { top: 150, right: 60 }]} />
            <View style={[styles.decorationDot, { top: 200, left: 80 }]} />
            <View style={[styles.decorationDot, { top: 120, right: 100 }]} />
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/hero-logo.png')}
              style={{ width: HERO_LOGO_SIZE, height: HERO_LOGO_SIZE, resizeMode: 'contain' }}
            />
          </View>
          <Text style={[styles.appTitle, { color: theme.text }]}>APRENDER +</Text>
        </View>

        {/* Bottom Section - Content */}
        <LinearGradient colors={theme.gradient} style={styles.gradient}>
          <View style={styles.handle} />

          <View style={styles.contentWrapper}>
            <View
              onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
              style={{ width: '100%' }}
            >
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const w = e.nativeEvent.layoutMeasurement.width || pageWidth;
                  const idx = Math.round(e.nativeEvent.contentOffset.x / w);
                  setCurrentIndex(idx);
                }}
                onScrollBeginDrag={() => { isDraggingRef.current = true; }}
                onScrollEndDrag={() => { isDraggingRef.current = false; }}
                contentContainerStyle={{ alignItems: 'center', paddingTop: 0, paddingBottom: 96 }}
                style={{ width: '100%' }}
              >
                {onboardingData.map((slide, idx) => (
                  <View key={idx} style={[styles.slide, { width: pageWidth }]}>
                    <Text style={styles.slideTitle}>{slide.title}</Text>
                    <Text style={styles.slideDescription}>{slide.description}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setCurrentIndex(index);
                scrollRef.current?.scrollTo({ x: index * pageWidth, animated: true });
              }}
              style={[styles.dot, { backgroundColor: index === currentIndex ? '#FF9800' : '#E5E7EB' }]}
            />
          ))}
          </View>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/auth/signup')}>
              <Text style={styles.registerButtonText}>Registro</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
            <Ionicons name="chevron-forward" size={16} color="#1976D2" />
          </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: '#59B3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  hexagon: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1976D2',
    transform: [{ rotate: '-30deg' }],
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1,
    zIndex: 1,
  },
  decorationLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  decorationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  gradient: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 56,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  slideDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 128,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FF9800',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 12,
  },
  registerButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
});
