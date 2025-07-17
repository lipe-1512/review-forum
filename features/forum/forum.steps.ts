import { defineFeature, loadFeature } from 'jest-cucumber';
import ForumService from '../../src/services/ForumService';
import MovieServices from '../../src/services/MovieServices';
import ForumRepository from '../../src/repository/ForumRepository';
import { Forum } from '../../src/models/Forum';
import { Movie } from '../../src/models/Movie';

const feature = loadFeature('./features/forum.feature');

// Mock dos serviços
jest.mock('../src/services/ForumService');
jest.mock('../src/services/MovieServices');
jest.mock('../src/repository/ForumRepository');

const MockedForumService = ForumService as jest.MockedClass<typeof ForumService>;
const MockedMovieServices = MovieServices as jest.MockedClass<typeof MovieServices>;
const MockedForumRepository = ForumRepository as jest.MockedClass<typeof ForumRepository>;

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creating a forum', ({ given, when, then }) => {
    const context: any = {};

    given('i\'m logged as user with username "var3"', () => {
      context.username = 'var3';
    });

    given('he is on the "Forums Listing" page', () => {
      // Apenas verificação de navegação, não precisa implementação no teste unitário
    });

    given('the Movie "Sonic 3" exists with ID "3"', () => {
      const mockMovie = new Movie('Sonic 3', 'Description of Sonic 3');
      Object.defineProperty(mockMovie, 'id', { value: 3 });
      
      jest.spyOn(MovieServices, 'getById').mockResolvedValue(mockMovie);
      context.mockMovie = mockMovie;
    });

    when('this user creates a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should\'ve done better this time" And Related Movie "3"', async () => {
      const forumData = {
        title: 'O que vocês acharam do Sonic 3?',
        description: 'I think went well, but should\'ve done better this time',
        movieId: 3,
        username: context.username
      };

      const mockForum = new Forum(
        forumData.title,
        forumData.description,
        forumData.username,
        context.mockMovie
      );

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
      expect(context.result.username).toBe('var3');
      expect(context.result.related_movie).toBeDefined();
      expect(context.result.related_movie.id).toBe(3);
      expect(ForumRepository.saveForum).toHaveBeenCalledTimes(1);
      expect(MovieServices.getById).toHaveBeenCalledWith(3);
    });
  });

  test('Fail to create a forum without a title', ({ given, when, then }) => {
    const context: any = {};

    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
    });

    given('the Movie "Sonic 3" exists', () => {
      const mockMovie = new Movie('Sonic 3', 'Description of Sonic 3');
      Object.defineProperty(mockMovie, 'id', { value: 3 });
      
      jest.spyOn(MockedMovieServices, 'getById').mockResolvedValue(mockMovie);
    });

    when('the user create a Forum with no Title, Related Movie "3"', async () => {
      const forumData = {
        title: '',
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
      expect(MockedForumRepository.saveForum).not.toHaveBeenCalled();
    });

    then('shold raise a error saying that "O título do forum é obrigatório"', () => {
      expect(context.error.message).toBe('O título do forum é obrigatório');
    });
  });

  test('Fail to create a forum', ({ given, when, then }) => {
    const context: any = {};

    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
    });

    given('the Movie with title "Sonic 3" is saved with id "3"', () => {
      const mockMovie = new Movie('Sonic 3', 'Description of Sonic 3');
      Object.defineProperty(mockMovie, 'id', { value: 3 });
      
      jest.spyOn(MockedMovieServices, 'getById').mockResolvedValue(mockMovie);
    });

    when('try to create a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should\'ve done better this time", Related Movie "3" And username ""', async () => {
      const forumData = {
        title: 'O que vocês acharam do Sonic 3?',
        description: 'I think went well, but should\'ve done better this time',
        movieId: 3,
        username: ''
      };

      try {
        await ForumService.saveForum(forumData);
      } catch (error) {
        context.error = error;
      }
    });

    then('the Forum must not be created', () => {
      expect(context.error).toBeDefined();
      expect(MockedForumRepository.saveForum).not.toHaveBeenCalled();
    });

    then('shold raise a error saying that "O usuário é um campo obrigatório"', () => {
      expect(context.error.message).toBe('O usuário é um campo obrigatório');
    });
  });

  test('Fail to create a Forum with non existing movie', ({ given, when, then }) => {
    const context: any = {};

    given('i\'m logged as user with username "johndoe"', () => {
      context.username = 'johndoe';
    });

    given('the Movie with ID 3 does not exist', () => {
      jest.spyOn(MockedMovieServices, 'getById').mockResolvedValue(null);
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
      expect(MockedForumRepository.saveForum).not.toHaveBeenCalled();
    });

    then('shold raise a error saying that "O Movie com o ID 3 não existe"', () => {
      expect(context.error.message).toBe('Filme relacionado não encontrado');
    });
  });
});
