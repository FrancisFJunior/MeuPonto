# Meu Ponto - App de Controle de Ponto

Um aplicativo React Native profissional para controle de ponto eletrônico, desenvolvido com foco em simplicidade e usabilidade.

## 🎯 Objetivo

O Meu Ponto é um app mobile que permite aos funcionários controlar suas horas de trabalho de forma simples e intuitiva, com controle de banco de horas e histórico completo.

## ✨ Funcionalidades

### 🔐 Perfil do Usuário
- Criação de perfil personalizado
- Username fixo (não editável)
- Dados pessoais editáveis
- Saldo inicial de horas configurável

### ⏰ Bater Ponto
- Botão central flutuante para bater ponto
- Limite de 8 pontos por dia
- Registro automático de horário
- Validação de entrada/saída

### 📊 Dashboard
- Banco de horas em tempo real
- Timeline visual do dia atual
- Barra de progresso (meta: 8h)
- Saldo atual calculado automaticamente

### 📅 Histórico
- Lista de dias anteriores
- Progresso visual por dia
- Detalhes dos pontos batidos
- Ordenação por data (mais recente primeiro)

## 🏗️ Arquitetura

### Stack Tecnológica
- **React Native** com Expo
- **TypeScript** para tipagem estática
- **Context API** para gerenciamento de estado
- **AsyncStorage** para persistência local
- **Expo Vector Icons** para ícones

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Contexto global da aplicação
├── navigation/         # Navegação entre telas
├── screens/            # Telas principais
├── services/           # Serviços (storage, API)
├── types/              # Definições TypeScript
└── utils/              # Utilitários e helpers
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd MeuPonto

# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

### Comandos Disponíveis
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
```

## 📱 Telas do App

### 1. Onboarding
- Configuração inicial do usuário
- Formulário de criação de perfil
- Explicação das funcionalidades

### 2. Home (Dashboard)
- Saudação personalizada
- Card do banco de horas
- Timeline do dia atual
- Botão flutuante para bater ponto

### 3. Histórico
- Lista de dias com pontos
- Status visual por dia
- Detalhes dos horários
- Progresso em relação à meta

### 4. Perfil
- Informações do usuário
- Campos editáveis
- Opção de limpar dados
- Validações de formulário

## 🔧 Componentes Principais

### BancoHorasCard
Exibe o saldo atual, saldo inicial, horas trabalhadas e previstas.

### TimelineCard
Mostra a timeline do dia com barra de progresso e lista de horários.

### FloatingActionButton
Botão central para bater ponto com validação de limite diário.

### BottomTabBar
Navegação inferior com ícones para as principais telas.

## 💾 Persistência de Dados

### StorageService
- **AsyncStorage** para dados locais
- Persistência de usuário e pontos
- Operações CRUD para pontos
- Backup e restauração de dados

### Estrutura dos Dados
```typescript
interface User {
  username: string;        // Fixo, não editável
  nome: string;           // Nome completo
  email: string;          // E-mail do usuário
  saldoHorasInicial: number; // Saldo inicial em horas
}

interface Ponto {
  id: string;             // ID único
  dia: string;            // Data (YYYY-MM-DD)
  horarios: string[];     // Array de horários
  totalTrabalhado: number; // Total de horas trabalhadas
}
```

## 🎨 Design System

### Cores
- **Primária**: #3B82F6 (Azul)
- **Sucesso**: #10B981 (Verde)
- **Aviso**: #F59E0B (Amarelo)
- **Erro**: #EF4444 (Vermelho)
- **Neutro**: #6B7280 (Cinza)

### Tipografia
- **Títulos**: 18-28px, peso 600-700
- **Corpo**: 14-16px, peso 400-500
- **Legendas**: 12-14px, peso 400-500

### Componentes
- Cards com bordas arredondadas (16px)
- Sombras sutis para profundidade
- Espaçamento consistente (8px grid)
- Ícones minimalistas (Ionicons)

## 📊 Lógica de Negócio

### Cálculo do Banco de Horas
```
Saldo Atual = Saldo Inicial + (Horas Trabalhadas - Horas Previstas)
```

### Validações
- Máximo 8 pontos por dia
- Horários em formato HH:MM
- Cálculo automático de horas trabalhadas
- Validação de entrada/saída

### Progresso Diário
```
Progresso = (Horas Trabalhadas / Meta de 8h) × 100
```

## 🔮 Funcionalidades Futuras

- [ ] Notificações push para lembrar de bater ponto
- [ ] Exportação de histórico em PDF/Excel
- [ ] Modo escuro automático
- [ ] Sincronização com nuvem
- [ ] Múltiplos usuários
- [ ] Relatórios avançados
- [ ] Backup automático

## 🐛 Solução de Problemas

### Problemas Comuns
1. **App não inicia**: Verificar se todas as dependências estão instaladas
2. **Erro de storage**: Limpar cache do Expo ou reinstalar app
3. **Problemas de navegação**: Verificar se o contexto está sendo fornecido

### Logs e Debug
- Use `console.log` para debug
- Verifique o console do Metro bundler
- Use React Native Debugger para inspeção

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais oficiais do projeto.

---

**Desenvolvido com ❤️ usando React Native e Expo**
