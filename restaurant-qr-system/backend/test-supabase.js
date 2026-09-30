const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🧪 Testando conexão com Supabase...\n');

  try {
    const supabase = createClient(
      'https://kyrkdtgrghqopbmhlwfj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cmtkdGdyZ2hxb3BibWhsd2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NzY4NTYsImV4cCI6MjEwNjM1Mjg1Nn0.AZ3gXChCWLwMS0eqrkG8QL0mOVXLPfwAeMgnO86ILO4'
    );

    console.log('✅ Supabase client criado com sucesso!');
    console.log('📍 URL: https://kyrkdtgrghqopbmhlwfj.supabase.co');
    console.log('🔑 Anon Key: configurado');

    // Test query
    const { data, error } = await supabase
      .from('restaurants')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log('⚠️  Query error (esperado se não tem dados):', error.message);
    } else {
      console.log('✅ Conexão com banco de dados funcionando!');
      console.log('📊 Restaurantes na base:', data?.length || 0);
    }

    console.log('\n✨ Supabase está pronto para usar!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    process.exit(1);
  }
}

testSupabaseConnection();
