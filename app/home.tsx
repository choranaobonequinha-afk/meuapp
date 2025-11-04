import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type ProfileRow = {
  id: string;
  email?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProfiles = useCallback(async (options?: { showLoader?: boolean }) => {
    try {
      if (options?.showLoader) {
        setLoading(true);
      }
      setErrorMessage(null);
      const { data, error } = await supabase.from('profiles').select('*').limit(10);
      if (error) {
        if (error?.message?.toLowerCase().includes('does not exist')) {
          setErrorMessage('Tabela "profiles" nao encontrada. Veja o README para criar a tabela de teste.');
        } else {
          setErrorMessage(error.message);
        }
        setRows([]);
        return;
      }
      setRows(data ?? []);
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Falha ao carregar perfis.');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles({ showLoader: true });
  }, [fetchProfiles]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  const renderItem = ({ item }: { item: ProfileRow }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.email ?? 'Sem email'}</Text>
      <Text style={styles.cardSubtitle}>id: {item.id}</Text>
      {item.created_at ? <Text style={styles.cardSubtitle}>criado em: {new Date(item.created_at).toLocaleString()}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smoke Test Supabase</Text>
        <Text style={styles.subtitle}>
          Usuario autenticado: {user?.email ?? 'desconhecido'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loaderText}>Carregando dados da tabela "profiles"...</Text>
        </View>
      ) : (
        <>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              contentContainerStyle={rows.length === 0 ? styles.emptyList : undefined}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhum registro encontrado na tabela "profiles".
                </Text>
              }
            />
          )}
        </>
      )}

      <View style={styles.footer}>
        <Button title="Atualizar lista" onPress={() => fetchProfiles({ showLoader: true })} />
        <Button title="Sair" onPress={signOut} variant="ghost" style={styles.signOutButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#4B5563',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    color: '#4B5563',
  },
  errorBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    gap: 12,
  },
  signOutButton: {
    marginTop: 4,
  },
});
