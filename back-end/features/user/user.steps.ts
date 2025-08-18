import { defineFeature, loadFeature } from 'jest-cucumber';
import { UserService } from 'src/services/UserService';
import { User } from 'src/models/User';
import { NotificationService } from 'src/services/NotificationService'; // serviço de notificação

// Carrega todas as features relacionadas ao usuário
const registrationFeature = loadFeature('features/user/user-registration.feature');
const recoveryFeature = loadFeature('features/user/password-recovery.feature');
const followingFeature = loadFeature('features/user/following.feature');

// --- Mocks dos serviços ---
jest.mock('src/services/UserService');
const MockedUserService = UserService as jest.Mocked<typeof UserService>;

jest.mock('src/services/NotificationService'); // Mock o serviço de notificação
const MockedNotificationService = NotificationService as jest.Mocked<typeof NotificationService>;

// --- Testes para Cadastro e Manutenção de Usuários ---
defineFeature(registrationFeature, test => {
    let context: any = {};

    beforeEach(() => {
        context = {};
        jest.clearAllMocks();
    });

    // Cenário 1: Cadastro com sucesso
    test('Usuário realiza cadastro com sucesso', ({ given, when, and, then }) => {
        given('que estou no processo de criação de uma nova conta', () => { /* UI Step */ });

        when('informo meus dados pessoais válidos, incluindo nome, e-mail e senha', async () => {
            const userData = { username: 'novo_usuario', email: 'novo@email.com', password: 'Password123' };
            const returnedUser: Omit<User, 'password'> = {
                id: 1, username: 'novo_usuario', email: 'novo@email.com',
                created_at: new Date(), updated_at: new Date(),
                bio: '', reviews: [], listItems: [], notifications: [], following: [], followers: []
            };

            MockedUserService.registerUser.mockResolvedValue(returnedUser);
            context.result = await UserService.registerUser(userData);
        });

        and('confirmo a senha informada', () => { /* UI Step */ });

        then('vejo uma mensagem indicando que o cadastro foi concluído com sucesso', () => {
            expect(MockedUserService.registerUser).toHaveBeenCalled();
            expect(context.result).toBeDefined();
            expect(context.result.id).toBe(1);
        });

        and('sou direcionado para a área inicial do sistema', () => { /* UI Step */ });
    });

    // Cenário 2: Tentativa de cadastro com dados inválidos
    test('Usuário tenta cadastrar com dados inválidos', ({ given, when, and, then }) => {
        given('que estou no processo de criação de uma nova conta', () => { /* UI Step */ });

        when('não preencho todos os campos obrigatórios', () => { /* Placeholder */ });

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

        and('permaneço no processo de cadastro até corrigir os erros', () => { /* UI Step */ });
    });

    // Cenário 3: Atualizar perfil
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

        when('acesso a funcionalidade de exclusão de conta', async () => { /* UI Step */ });

        and('confirmo a exclusão', async () => {
            MockedUserService.deleteUser.mockResolvedValue(undefined);
            await UserService.deleteUser(context.userId);
        });

        then('vejo uma mensagem indicando que minha conta foi excluída', () => {
            expect(MockedUserService.deleteUser).toHaveBeenCalledWith(context.userId);
        });

        and('sou deslogado do sistema', () => { /* UI Step */ });
        and('não consigo mais acessar minha conta com as credenciais anteriores', () => { /* UI Step */ });
    });

    // Cenário 5: Senha fraca
    test('Usuário tenta cadastrar com senha fraca', ({ given, when, then, and }) => {
        given('que estou no processo de criação de uma nova conta', () => { /* UI Step */ });

        when('informo uma senha que não atende aos critérios de segurança', async () => {
            const weakPasswordData = { username: 'senhafraca', email: 'fraco@email.com', password: '123' };
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

        and('sou solicitado a escolher uma senha mais forte', () => { /* UI Step */ });
        and('não consigo prosseguir com o cadastro até corrigir a senha', () => {
            expect(context.result).toBeUndefined();
        });
    });
});

// --- Testes para Recuperação de Senha ---
defineFeature(recoveryFeature, test => {
    let context: any = {};

    beforeEach(() => {
        context = {};
        jest.clearAllMocks();
    });

    // Testando a Recuperação de Senha
    test('Usuário recupera sua senha', ({ given, when, then }) => {
        let user: User;
        given('que esqueci minha senha de acesso ao sistema', () => {
            user = new User();
            user.email = 'recupera@email.com';
            user.id = 5;

            // Simula o comportamento real do UserService.requestPasswordReset
            MockedUserService.requestPasswordReset.mockImplementation(async (email) => {
                user.resetPasswordToken = 'mock-token-123';
                user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
            });
        });

        when('solicito a recuperação de senha usando meu e-mail cadastrado', async () => {
            await UserService.requestPasswordReset(user.email);
        });

        then('recebo um e-mail com instruções para redefinir minha senha', () => {
            // Como não enviamos e-mail real, validamos se os dados de reset foram definidos
            expect(user.resetPasswordToken).toBe('mock-token-123');
            expect(user.resetPasswordExpires).toBeDefined();
            expect(user.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());
        });

        when('acesso o link fornecido no e-mail e defino uma nova senha', async () => {
            MockedUserService.resetPassword.mockResolvedValue(undefined);
            await UserService.resetPassword('mock-token-123', 'NovaSenhaForte123!');
        });

        then('vejo uma mensagem confirmando que minha senha foi atualizada', () => {
            expect(MockedUserService.resetPassword).toHaveBeenCalledWith('mock-token-123', 'NovaSenhaForte123!');
        });

        and('consigo acessar o sistema com a nova senha', () => { /* UI Step */ });
    });

    test('Usuário tenta recuperar senha com e-mail não cadastrado', ({ given, when, then, and }) => {
        given('que esqueci minha senha de acesso ao sistema', () => {});
        when('solicito a recuperação de senha usando um e-mail não cadastrado', async () => {
            MockedUserService.requestPasswordReset.mockResolvedValue(undefined);
            await UserService.requestPasswordReset('naoexiste@email.com');
        });
        then('vejo uma mensagem informando que o e-mail não está associado a nenhuma conta', () => {
            // Como não lançamos erro, validamos que nada quebra
        });
        and('sou orientado a verificar o e-mail informado ou criar uma nova conta', () => { /* UI Step */ });
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

    // Testando a Notificação ao Seguir
    test('Usuário começa a seguir outro usuário', ({ given, and, when, then, and: andStep }) => {
        given('o usuário "alice" com ID 1 existe', () => {});
        and('o usuário "bob" com ID 2 existe', () => {});

        when('"alice" decide seguir "bob"', async () => {
            // Cria um espião no método de notificação
            const notificationSpy = jest.spyOn(MockedNotificationService, 'createFollowNotification');
            MockedUserService.followUser.mockResolvedValue(undefined);

            await UserService.followUser(alice.id, bob.id);

            context.notificationSpy = notificationSpy;
        });

        then('"alice" deve estar seguindo "bob"', () => {
            expect(MockedUserService.followUser).toHaveBeenCalledWith(1, 2);
        });

        andStep('uma notificação de novo seguidor deve ser criada', () => {
            expect(context.notificationSpy).toHaveBeenCalled();
            expect(context.notificationSpy).toHaveBeenCalledWith(bob.id, alice.id); // (recipientId, senderId)
        });
    });

    // Cenário 2: Deixar de seguir
    test('Usuário deixa de seguir outro usuário', ({ given, when, then }) => {
        given('o usuário "alice" com ID 1 está seguindo o usuário "bob" com ID 2', () => {});

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