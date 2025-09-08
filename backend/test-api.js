#!/usr/bin/env node

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Iniciando testes da API RecolheJá...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testando registro de usuário...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Teste User',
      email: `test${Date.now()}@example.com`,
      password: '123456',
    });
    
    const { access_token } = registerResponse.data;
    console.log('✅ Usuário registrado com sucesso');

    // Set auth header for subsequent requests
    const authHeaders = {
      Authorization: `Bearer ${access_token}`,
    };

    // Test 2: Get user profile
    console.log('2. Testando perfil do usuário...');
    await axios.get(`${BASE_URL}/users/profile`, { headers: authHeaders });
    console.log('✅ Perfil do usuário obtido com sucesso');

    // Test 3: Get collection points
    console.log('3. Testando pontos de coleta...');
    await axios.get(`${BASE_URL}/points`);
    console.log('✅ Pontos de coleta obtidos com sucesso');

    // Test 4: Create collection point
    console.log('4. Testando criação de ponto de coleta...');
    await axios.post(
      `${BASE_URL}/points`,
      {
        name: 'Ponto Teste',
        lat: -23.5505,
        lon: -46.6333,
        address: 'Endereço Teste, 123',
        acceptedCategories: ['PLASTICO', 'PAPEL'],
        openingHours: 'Segunda a Sexta: 8h às 18h',
        contact: '(11) 1234-5678',
      },
      { headers: authHeaders }
    );
    console.log('✅ Ponto de coleta criado com sucesso');

    // Test 5: Get events
    console.log('5. Testando eventos...');
    await axios.get(`${BASE_URL}/events`);
    console.log('✅ Eventos obtidos com sucesso');

    // Test 6: Create event
    console.log('6. Testando criação de evento...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 4);

    await axios.post(
      `${BASE_URL}/events`,
      {
        title: 'Evento Teste',
        description: 'Descrição do evento teste para validação da API',
        lat: -23.5505,
        lon: -46.6333,
        startAt: futureDate.toISOString(),
        endAt: endDate.toISOString(),
        acceptedCategories: ['PLASTICO', 'PAPEL'],
      },
      { headers: authHeaders }
    );
    console.log('✅ Evento criado com sucesso');

    // Test 7: Get user stats
    console.log('7. Testando estatísticas do usuário...');
    await axios.get(`${BASE_URL}/users/stats`, { headers: authHeaders });
    console.log('✅ Estatísticas do usuário obtidas com sucesso');

    console.log('\n🎉 Todos os testes passaram! A API está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
axios.get(`${BASE_URL}/../`)
  .then(() => {
    console.log('🟢 Servidor detectado, iniciando testes...\n');
    testAPI();
  })
  .catch(() => {
    console.error('❌ Servidor não está rodando. Execute "npm run start:dev" primeiro.');
    process.exit(1);
  });
