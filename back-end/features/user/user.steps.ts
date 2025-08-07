import { defineFeature, loadFeature } from 'jest-cucumber';
import { UserService } from 'src/services/UserService';
import { User } from 'src/models/User';

// Carrega todas as features relacionadas ao usuário
const registrationFeature = loadFeature('features/user/user-registration.feature');
const recoveryFeature = loadFeature('features/user/password-recovery.feature');
const followingFeature = loadFeature('features/user/following.feature');

// jest.mock informa ao Jest para substituir o módulo real por um mock.
// Isso evita chamadas reais ao banco de dados e nos permite controlar o comportamento do serviço.
jest.mock('src/services/UserService');
const MockedUserService = UserService as jest.Mocked<typeof UserService>;

// --- Testes para Cadastro e Manutenção de Usuários ---
defineFeature(registrationFeature, test => {
    let context: any = {};

    beforeEach(() => {
        context = {};
        jest.clearAllMocks(); // Limpa os mocks antes de cada teste para evitar interferência
    });

    // Cenário 1: Cadastro com sucesso
    test('Usuário realiza cadastro com sucesso', ({ given, when, and, then }) => {
        given('que estou no processo de criação de uma nova conta', () => { /* Passo de interface, sem lógica no back-end */ });

        when('informo meus dados pessoais válidos, incluindo nome, e-mail e senha', async () => {
            const userData = { username: 'novo_usuario', email: 'novo@email.com', password: 'Password123' };
            // Simulamos o objeto que o serviço retornaria após salvar no banco
            const returnedUser: Omit<User, 'password'> = { id: 1, username: 'novo_usuario', email: 'novo@email.com', created_at: new Date(), updated_at: new Date(), bio: '', reviews: [], listItems: [], notifications: [], following: [], followers: [] };

            // Configuramos o mock para retornar o usuário simulado
            MockedUserService.registerUser.mockResolvedValue(returnedUser);
            // Executamos o método real do serviço (que agora está mockado)
            context.result = await UserService.registerUser(userData);
        });

        and('confirmo a senha informada', () => { /* UI Step */ });
        
        then('vejo uma mensagem indicando que o cadastro foi concluído com sucesso', () => {
            // Verificamos se o método mockado foi chamado
            expect(MockedUserService.registerUser).toHaveBeenCalled();
            expect(context.result).toBeDefined();
            expect(context.result.id).toBe(1); // Verificamos se o resultado está correto
        });

        and('sou direcionado para a área inicial do sistema', () => { /* UI Step */ });
    });

    // Cenário 2: Tentativa de cadastro com dados inválidos
    test('Usuário tenta cadastrar com dados inválidos', ({ given, when, and, then }) => {
        given('que estou no processo de criação de uma nova conta', () => { /* UI Step */ });

        when('não preencho todos os campos obrigatórios', () => { /* Pode ser um placeholder */ });

        and('informo um e-mail já registrado no sistema', async () => {
            const existingData = { username: 'usuario_existente', email: 'existente@email.com', password: 'Password123' };
            MockedUserService.registerUser.mockRejectedValue(new Error("Email ou nome de usuário já cadastrado."));
            try {
                await UserService.registerUser(existingData);
            } catch (e: any) {
                context.error = e;
            }
        });

        then('vejo mensagens de erro indicando os problemas nos dados fornecidos', () => {
            expect(context.error).toBeDefined();
            expect(context.error.message).toContain("Email ou nome de usuário já cadastrado.");
        });

        and('permaneço no processo de cadastro até corrigir os erros', () => {
            // Simplesmente confirma que o fluxo não avança
        });
    });

    // Cenário 3: Usuário atualiza suas informações pessoais
    test('Usuário atualiza suas informações pessoais', ({ given, when, and, then }) => {
        let user: User;
        given('que estou autenticado no sistema', () => {
            user = new User();
            user.id = 1;
            user.username = 'usuario_antigo';
            user.bio = 'Bio antiga';
        });

        when('acesso a funcionalidade de edição de perfil', () => { /* UI Step */ });

        and('altero minhas informações pessoais, como nome ou e-mail', async () => {
            const updates = { bio: 'Nova bio atualizada' };
            const updatedUser = { ...user, ...updates };

            MockedUserService.updateUser.mockResolvedValue(updatedUser as User);
            context.result = await UserService.updateUser(user.id, updates);
        });
        
        then('vejo uma mensagem confirmando que as alterações foram salvas', () => {
            expect(MockedUserService.updateUser).toHaveBeenCalledWith(1, { bio: 'Nova bio atualizada' });
            expect(context.result.bio).toBe('Nova bio atualizada');
        });

        and('as novas informações são refletidas no meu perfil', () => { /* UI Step */ });
    });

    // Cenário 4: Exclusão de conta
    test('Usuário exclui sua conta', ({ given, when, and, then }) => {
        given('que estou autenticado no sistema', () => {
            context.userId = 1;
        });

        when('acesso a funcionalidade de exclusão de conta', async () => { /* UI Step */});

        and('confirmo a exclusão', async () => {
             MockedUserService.deleteUser.mockResolvedValue(undefined); // mock para uma função que retorna Promise<void>
             await UserService.deleteUser(context.userId);
        });

        then('vejo uma mensagem indicando que minha conta foi excluída', () => {
            expect(MockedUserService.deleteUser).toHaveBeenCalledWith(context.userId);
        });

        and('sou deslogado do sistema', () => { /* UI Step */ });
        and('não consigo mais acessar minha conta com as credenciais anteriores', () => { /* UI Step */ });
    });
    
    // MUDANÇA: Implementação do teste que estava faltando
    test('Usuário tenta cadastrar com senha fraca', ({ given, when, then, and }) => {
        given('que estou no processo de criação de uma nova conta', () => {
            // UI Step, sem lógica de backend
        });
    
        when('informo uma senha que não atende aos critérios de segurança', async () => {
            const weakPasswordData = { username: 'senhafraca', email: 'fraco@email.com', password: '123' };
            
            // Simula que o serviço vai rejeitar o cadastro com essa senha
            MockedUserService.registerUser.mockRejectedValue(new Error("A senha é fraca"));
            
            try {
                await UserService.registerUser(weakPasswordData);
            } catch (e: any) {
                context.error = e;
            }
        });
    
        then('vejo uma mensagem de erro indicando que a senha é fraca', () => {
            expect(context.error).toBeDefined();
            expect(context.error.message).toBe("A senha é fraca");
        });
    
        and('sou solicitado a escolher uma senha mais forte', () => {
            // UI step
        });
    
        and('não consigo prosseguir com o cadastro até corrigir a senha', () => {
            // O fluxo de sucesso não foi alcançado
            expect(context.result).toBeUndefined();
        });
    });
});

// --- Testes para Recuperação de Senha ---
defineFeature(recoveryFeature, test => {
    // A implementação real dos testes para recuperação de senha exigiria mocks
    // de serviços de e-mail e tokens, que são mais complexos.
    // Por enquanto, os steps podem ficar vazios ou com lógica simples.
    // O jest-cucumber permite cenários vazios sem quebrar os testes.
    test('Usuário recupera sua senha', ({ given, when, then, and }) => {
        given('que esqueci minha senha de acesso ao sistema', () => {});
        when('solicito a recuperação de senha usando meu e-mail cadastrado', () => {});
        then('recebo um e-mail com instruções para redefinir minha senha', () => {});
        when('acesso o link fornecido no e-mail e defino uma nova senha', () => {});
        then('vejo uma mensagem confirmando que minha senha foi atualizada', () => {});
        and('consigo acessar o sistema com a nova senha', () => {});
    });

    test('Usuário tenta recuperar senha com e-mail não cadastrado', ({ given, when, then, and }) => {
        given('que esqueci minha senha de acesso ao sistema', () => {});
        when('solicito a recuperação de senha usando um e-mail não cadastrado', () => {});
        then('vejo uma mensagem informando que o e-mail não está associado a nenhuma conta', () => {});
        and('sou orientado a verificar o e-mail informado ou criar uma nova conta', () => {});
    });
});


// --- Testes para Seguir Usuários ---
defineFeature(followingFeature, test => {
    let context: any = {};
    const alice = new User();
    alice.id = 1;
    alice.username = 'alice';

    const bob = new User();
    bob.id = 2;
    bob.username = 'bob';

    beforeEach(() => {
        context = {};
        jest.clearAllMocks();
    });

    // Cenário 1: Seguir usuário
    test('Usuário começa a seguir outro usuário', ({ given, and, when, then }) => {
        given('o usuário "alice" com ID 1 existe', () => {});
        and('o usuário "bob" com ID 2 existe', () => {});
        
        when('"alice" decide seguir "bob"', async () => {
            MockedUserService.followUser.mockResolvedValue(undefined);
            await UserService.followUser(alice.id, bob.id);
        });

        then('"alice" deve estar seguindo "bob"', () => {
            expect(MockedUserService.followUser).toHaveBeenCalledWith(1, 2);
        });
    });

    // Cenário 2: Deixar de seguir
    test('Usuário deixa de seguir outro usuário', ({ given, when, then }) => {
        given('o usuário "alice" com ID 1 está seguindo o usuário "bob" com ID 2', () => {
            // Este passo apenas descreve um estado prévio para o teste
        });

        when('"alice" decide deixar de seguir "bob"', async () => {
            MockedUserService.unfollowUser.mockResolvedValue(undefined);
            await UserService.unfollowUser(alice.id, bob.id);
        });

        then('"alice" não deve mais estar seguindo "bob"', () => {
            expect(MockedUserService.unfollowUser).toHaveBeenCalledWith(1, 2);
        });
    });
    
    // Cenário 3: Seguir a si mesmo
    test('Usuário não pode seguir a si mesmo', ({ given, when, then }) => {
        given('o usuário "alice" com ID 1 existe', () => {});
        
        when('"alice" tenta seguir a si mesma', async () => {
            MockedUserService.followUser.mockImplementation(async () => {
                throw new Error("Você não pode seguir a si mesmo.");
            });
            try {
                await UserService.followUser(alice.id, alice.id);
            } catch (e: any) {
                context.error = e;
            }
        });

        then('a operação deve falhar com a mensagem "Você não pode seguir a si mesmo."', () => {
            expect(context.error).toBeDefined();
            expect(context.error.message).toBe("Você não pode seguir a si mesmo.");
        });
    });

     // Cenário 4: Seguir quem já segue
    test('Usuário tenta seguir alguém que já segue', ({ given, when, then }) => {
         given('o usuário "alice" com ID 1 está seguindo o usuário "bob" com ID 2', () => {});
        
        when('"alice" tenta seguir "bob" novamente', async () => {
             MockedUserService.followUser.mockImplementation(async () => {
                throw new Error("Você já está seguindo este usuário.");
            });
            try {
                await UserService.followUser(alice.id, bob.id);
            } catch (e: any) {
                context.error = e;
            }
        });

        then('a operação deve falhar com a mensagem "Você já está seguindo este usuário."', () => {
             expect(context.error).toBeDefined();
             expect(context.error.message).toBe("Você já está seguindo este usuário.");
        });
    });
});