### **1. Cadastro e Manutenção de Usuários**

#### **Cenário 1: Cadastro bem-sucedido**

Scenario: Usuário realiza cadastro com sucesso
  Given que estou no processo de criação de uma nova conta
  When informo meus dados pessoais válidos, incluindo nome, e-mail e senha
  And confirmo a senha informada
  Then vejo uma mensagem indicando que o cadastro foi concluído com sucesso
  And sou direcionado para a área inicial do sistema
```

#### **Cenário 2: Falha ao cadastrar por campos inválidos**

Scenario: Usuário tenta cadastrar com dados inválidos
  Given que estou no processo de criação de uma nova conta
  When não preencho todos os campos obrigatórios
  Or informo um e-mail já registrado no sistema
  Then vejo mensagens de erro indicando os problemas nos dados fornecidos
  And permaneço no processo de cadastro até corrigir os erros
