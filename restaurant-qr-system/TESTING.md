# 🧪 Guia de Testes - Restaurant QR System

Instruções passo-a-passo para testar todas as funcionalidades do sistema.

## ⚙️ Setup Inicial

### 1. Iniciar o Backend

```bash
cd backend
npm start
```

Você deve ver:
```
✅ Server running on port 5000
📍 API available at http://localhost:5000
🏥 Health check: http://localhost:5000/health
```

### 2. Iniciar o Frontend

Em outro terminal:
```bash
cd frontend
npm start
```

Você deve ver:
```
Compiled successfully!
You can now view frontend in the browser.
  Local: http://localhost:3000
```

## 🔐 Teste 1: Registro e Login do Restaurante

### Passo 1: Acessar Admin
1. Vá para `http://localhost:3000/admin/login`
2. Clique em "Registre-se"

### Passo 2: Criar Conta de Restaurante
Preencha os campos:
- **Nome**: "Restaurante Lisboa"
- **Email**: "admin@lisboa.pt"
- **Senha**: "senha123"
- **Telefone**: "+351 91 234 5678"
- **Endereço**: "Rua da Baixa, 25"
- **Cidade**: "Lisboa"

Clique em "Registrar"

**Esperado**: Deve redirecionar para o dashboard

### Passo 3: Fazer Logout
Clique no botão "Sair"

### Passo 4: Fazer Login
Use as credenciais criadas:
- **Email**: "admin@lisboa.pt"
- **Senha**: "senha123"

**Esperado**: Deve retornar ao dashboard

## 🎯 Teste 2: Gerenciar Mesas e QR Codes

### Passo 1: Criar Mesas
1. No dashboard, você deve estar na aba "Mesas"
2. Clique em "+ Nova Mesa"
3. Digite "1" como número da mesa
4. Confirme

**Esperado**: Deve aparecer um card com a mesa 1 e um QR code

### Passo 2: Criar Mais Mesas
Repita o processo para criar mesas 2, 3 e 4

**Esperado**: Deve ter 4 cards de mesas com QR codes diferentes

### Passo 3: Copiar QR Code
1. Clique com botão direito no QR code
2. Selecione "Inspecionar" (ou abra DevTools)
3. Procure pelo `<img>` do QR code
4. Copie o atributo `src` (data:image/...)

Alternativamente, pode tirar screenshot

## 🍽️ Teste 3: Gerenciar Cardápio

### Passo 1: Adicionar Pratos ao Menu
1. Clique na aba "Cardápio"
2. Clique em "+ Adicionar Prato"
3. Preencha:
   - **Nome**: "Bacalhau à Brás"
   - **Preço**: "15.50"
   - **Categoria**: "Peixe"

Clique em confirmar

### Passo 2: Adicionar Mais Pratos
```
1. "Francesinha" - 12.00 € - Sanduiche
2. "Arroz de Marisco" - 18.00 € - Arroz
3. "Pastéis de Nata" - 3.50 € - Sobremesa
4. "Cerveja Sagres" - 2.50 € - Bebidas
5. "Vinho Tinto" - 8.00 € - Bebidas
```

**Esperado**: Deve aparecer uma tabela com todos os pratos

## 👥 Teste 4: Fluxo do Cliente (Pedidos e Pagamento)

### Passo 1: Acessar Aplicação do Cliente
1. Abra uma nova aba/janela
2. Vá para `http://localhost:3000`

Você deve ver a tela de "Escanear QR Code da Mesa"

### Passo 2: Simular Escaneamento de QR Code
1. Volte ao dashboard do admin
2. Na aba Mesas, copie o conteúdo do QR code (JSON)
3. Volte para a tela do cliente
4. Cole no campo de input "Ou cole o código QR aqui para teste..."
5. Pressione Enter ou Paste

**Esperado**: 
- Deve aparecer "✓ Mesa 1 escaneada com sucesso!"
- Deve passar para a próxima tela pedindo o nome

### Passo 3: Informar Nome do Cliente
1. Digite um nome: "João Silva"
2. Clique em "Continuar"

**Esperado**: Deve abrir a tela com Menu e Resumo do Pedido

### Passo 4: Fazer Pedido
1. No menu, veja os pratos disponíveis
2. Selecione o checkbox de "Bacalhau à Brás"
3. Mude a quantidade para 2 (se desejar)
4. Clique em "Adicionar"

**Esperado**: 
- Deve aparecer mensagem de sucesso
- O item deve aparecer no "Seu Pedido - João Silva"

### Passo 5: Adicionar Mais Itens
1. Selecione "Cerveja Sagres" (quantidade 2)
2. Clique em "Adicionar"
3. Selecione "Pastéis de Nata" (quantidade 1)
4. Clique em "Adicionar"

**Esperado**: Todos os itens devem aparecer no resumo com o total calculado

### Passo 6: Realizar Pagamento
1. No resumo do pedido, verifique:
   - Bacalhau à Brás x2 = 31.00 €
   - Cerveja Sagres x2 = 5.00 €
   - Pastéis de Nata x1 = 3.50 €
   - **Total: 39.50 €**

2. Clique em "Pagar Minha Parte"

**Esperado**: 
- Deve aparecer mensagem de sucesso
- Deve passar para a tela de avaliação

## ⭐ Teste 5: Avaliação do Restaurante

### Passo 1: Deixar Avaliação
1. Você deve estar na tela de "Avaliar Restaurante"
2. Clique em 5 estrelas (★★★★★)
3. Escreva no comentário: "Excelente! Comida deliciosa!"
4. Clique em "Enviar Avaliação"

**Esperado**: 
- Deve aparecer mensagem de sucesso
- Deve voltar à tela de escanear QR code

### Passo 2: Verificar Avaliação no Admin
1. Volte ao dashboard do admin
2. Clique na aba "Avaliações ⭐"

**Esperado**: 
- Deve mostrar estatísticas: Média 5.0/5, Total 1
- Deve listar a avaliação de "João Silva" com 5 estrelas e comentário

## 👥 Teste 6: Dividir Conta (Múltiplos Clientes)

### Passo 1: Simular Segundo Cliente
1. Volte para a tela do cliente
2. Cole o QR code da mesa 1 novamente
3. Informe nome: "Maria Santos"
4. Faça um pedido: "Francesinha" x1 e "Vinho Tinto" x1
5. Total esperado: 20.00 €

**Esperado**: Deve calcular apenas os itens de Maria

### Passo 2: Verificar Pedido Original
1. Na mesma mesa, agora vem um terceiro cliente
2. Cole o QR code novamente
3. Informe nome: "Pedro Costa"
4. Veja o menu (os itens anteriores não aparecem)
5. Faça pedido: "Arroz de Marisco" x1

### Passo 3: Validação
Cada cliente deve:
- ✅ Pagar apenas seus itens
- ✅ Deixar sua própria avaliação
- ✅ Não ver os pedidos dos outros

## 🔄 Teste 7: Fluxo Completo (Novo Cliente)

**Repetir todo o fluxo com dados diferentes**:
1. Mesa diferente
2. Combinação diferente de pratos
3. Avaliação diferente (ex: 4 estrelas)

## 📊 Teste 8: Verificar Estatísticas

### No Dashboard Admin
1. Aba "Avaliações"
2. Verifique:
   - Média de classificações
   - Total de avaliações
   - Lista de todas as avaliações com comentários

## ✅ Checklist de Testes

- [ ] Registro de restaurante
- [ ] Login/Logout
- [ ] Criar mesas com QR codes
- [ ] Adicionar itens ao cardápio
- [ ] Cliente escanear QR code
- [ ] Cliente fazer pedido
- [ ] Cliente deixar avaliação
- [ ] Dividir conta entre múltiplos clientes
- [ ] Verificar estatísticas no admin
- [ ] Responsividade em mobile
- [ ] Atualização em tempo real

## 🐛 Troubleshooting

### Erro: "Não consegue conectar ao servidor"
- Verifique se o backend está rodando
- Verifique se porta 5000 está disponível
- Cheque o console do backend para erros

### Erro: "Banco de dados não encontrado"
- Execute: `npm start` no backend
- Verifique variáveis de ambiente no `.env`

### QR Code não funciona
- Certifique-se de copiar a linha inteira do JSON
- Cole no campo "Ou cole o código QR aqui"
- Pressione Enter

### Página branca no frontend
- Abra DevTools (F12)
- Cheque o console para erros
- Verifique se `REACT_APP_API_URL` está correto

## 📝 Notas Importantes

1. **Primeira Execução**: O banco de dados será criado automaticamente
2. **QR Code**: No modo teste, pode copiar/colar ao invés de escanear
3. **Dados de Teste**: Use dados realistas para melhor teste
4. **Concorrência**: Teste com múltiplos clientes na mesma mesa

---

**Tudo pronto? Deixe-me saber se encontrar qualquer problema!**
