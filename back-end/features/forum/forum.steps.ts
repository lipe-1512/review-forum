import { defineFeature, loadFeature } from 'jest-cucumber';
import ForumService from 'src/services/ForumService';
import MovieServices from 'src/services/MovieServices';
import ForumRepository from 'src/repository/ForumRepository';
import { Forum } from 'src/models/Forum';
import { Movie } from 'src/models/Movie';
import { User } from 'src/models/User';
import { UserRepository } from 'src/repository/UserRepository';

const feature = loadFeature('features/forum/forum.feature');

// Mock dos serviços e repositórios
const MockedForumService = ForumService as jest.MockedClass<typeof ForumService>;
const MockedMovieServices = MovieServices as jest.MockedClass<typeof MovieServices>;
const MockedForumRepository = ForumRepository as jest.MockedClass<typeof ForumRepository>;
const MockedUserRepository = UserRepository as jest.Mocked<typeof UserRepository>; // Necessário para a IDE

defineFeature(feature, test => {
  
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste para evitar interferências
    jest.clearAllMocks();
  });

  // Cenário de Sucesso
  test('creating a forum', ({ given, and, when, then }) => {
    const context: any = {};
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.username = 'var3';

    given('i\'m logged as user with username "var3"', () => {
      context.username = 'var3';
      // Simula a busca do usuário pelo username, que agora acontece no ForumService
      jest.spyOn(UserRepository, 'findOneBy').mockResolvedValue(mockUser);
    });

    and('he is on the "Forums Listing" page', () => {
      // Passo de navegação, sem lógica de backend necessária
    });

    and('the Movie "Sonic 3" exists with ID "3"', () => {
      const mockMovie = new Movie('Sonic 3', 'Description of Sonic 3');
      mockMovie.id = 3;
      
      jest.spyOn(MovieServices, 'getById').mockResolvedValue(mockMovie);
      context.mockMovie = mockMovie;
    });

    when('this user creates a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should\'ve done better this time" And Related Movie "3"', async () => {
      const forumData = {
        title: 'O que vocês acharam do Sonic 3?',
        description: 'I think went well, but should\'ve done better this time',
        movieId: context.mockMovie.id,
        username: context.username
      };

      const mockForum = new Forum(
        forumData.title,
        forumData.description,
        mockUser, 
        context.mockMovie
      );
      mockForum.id = 1;

      jest.spyOn(ForumRepository, 'saveForum').mockResolvedValue(mockForum);
      
      try {
        context.result = await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the Forum must be create successfully', () => {
      expect(context.error).toBeUndefined();
      expect(context.result).toBeDefined();
      expect(context.result.title).toBe('O que vocês acharam do Sonic 3?');
      expect(context.result.creator.username).toBe('var3'); 
      expect(context.result.related_movie).toBeDefined();
      expect(context.result.related_movie.id).toBe(3);
      
      // Verifica se as chamadas aos mocks foram feitas corretamente
      expect(UserRepository.findOneBy).toHaveBeenCalledWith({ username: 'var3' });
      expect(ForumRepository.saveForum).toHaveBeenCalledTimes(1);
      expect(MovieServices.getById).toHaveBeenCalledWith(3);
    });
  });

  // Cenário de Falha: Sem título
  test('Fail to create a forum without a title', ({ given, and, when, then }) => {
    const context: any = {};
    const mockUser = new User();
    mockUser.id = 2;
    mockUser.username = 'johndoe';
    
    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
    });

    and('the Movie "Sonic 3" exists', () => {
      const mockMovie = new Movie('Sonic 3', 'Description of Sonic 3');
      mockMovie.id = 3;
      jest.spyOn(MovieServices, 'getById').mockResolvedValue(mockMovie);
    });

    when('the user create a Forum with no Title, Related Movie "3"', async () => {
      const forumData = {
        title: '', // Título vazio
        movieId: 3,
        username: context.username
      };

      try {
        await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the forum should not be created', () => {
      expect(context.error).toBeDefined();
      expect(ForumRepository.saveForum).not.toHaveBeenCalled();
    });

    and('shold raise a error saying that "O título do forum é obrigatório"', () => {
      expect(context.error.message).toBe('O título do forum é obrigatório');
    });
  });

  // Cenário de Falha: Sem username
  test('Fail to create a forum without username', ({ given, and, when, then }) => {
    const context: any = {};
    const mockMovie = new Movie('Sonic 3', 'Description');
    mockMovie.id = 3;

    given('i\'m logged as user with username "johndoe"', () => {
        // Passo de contexto, não necessita ação
    });

    and('the Movie with title "Sonic 3" is saved with id "3"', () => {
        jest.spyOn(MovieServices, 'getById').mockResolvedValue(mockMovie);
    });
    
    when('try to create a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should\'ve done better this time", Related Movie "3" And username ""', async () => {
      const forumData = {
        title: 'O que vocês acharam do Sonic 3?',
        description: 'I think went well, but should\'ve done better this time',
        movieId: 3,
        username: '' // Username vazio
      };

      try {
        await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the Forum must not be created', () => {
      expect(context.error).toBeDefined();
      expect(ForumRepository.saveForum).not.toHaveBeenCalled();
    });

    and('shold raise a error saying that "O usuário é um campo obrigatório"', () => {
      expect(context.error.message).toBe('O usuário é um campo obrigatório');
    });
  });
  
  // Cenário de Falha: Filme não existente
  test('Fail to create a Forum with non existing movie', ({ given, and, when, then }) => {
    const context: any = {};
    const mockUser = new User();
    mockUser.id = 2;
    mockUser.username = 'johndoe';
    
    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
      jest.spyOn(UserRepository, 'findOneBy').mockResolvedValue(mockUser);
    });

    and('the Movie with ID 3 does not exist', () => {
      jest.spyOn(MovieServices, 'getById').mockResolvedValue(null);
    });
    
    when('this user tries to create e Forum with Title "Lorem ipsum lorem ipsum", Description "What ever" and Related Movie "3"', async () => {
      const forumData = {
        title: 'Lorem ipsum lorem ipsum',
        description: 'What ever',
        movieId: 3,
        username: context.username
      };

      try {
        await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the Forum must no be created', () => {
      expect(context.error).toBeDefined();
      expect(ForumRepository.saveForum).not.toHaveBeenCalled();
    });

    and('shold raise a error saying that "O Filme com o ID 3 não existe"', () => {
      expect(context.error.message).toBe("O Filme com o ID 3 não existe");
    });
  });

  // Cenário de Falha: Sem filme
  test('Fail to create a Forum without movie', ({ given, and, when, then }) => {
    const context: any = {};

    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
    });

    when('this user tries to create e Forum with Title "Lorem ipsum lorem ipsum", Description "What ever"', async () => {
      const forumData = {
        title: 'Lorem ipsum lorem ipsum',
        description: 'What ever',
        username: context.username,
        movieId: undefined // ID do filme ausente
      };

      try {
        await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the Forum must no be created', () => {
      expect(context.error).toBeDefined();
      expect(ForumRepository.saveForum).not.toHaveBeenCalled();
    });

    and('shold raise a error saying that "O filme é um campo obrigatório"', () => {
      expect(context.error.message).toBe("O filme é um campo obrigatório");
    });
  });
});