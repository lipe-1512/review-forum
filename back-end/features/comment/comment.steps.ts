import { defineFeature, loadFeature } from "jest-cucumber";
import CommentService from "src/services/CommentService";
import ForumService from "src/services/ForumService";
import CommentRepository from "src/repository/CommentRepository";
import Comment from "src/models/Comment";
import { User } from "src/models/User";
import { Forum } from "src/models/Forum";

const feature = loadFeature("features/comment/comment.feature");

const MockedCommentService = CommentService as jest.MockedClass<typeof CommentService>;
const MockedForumService = ForumService as jest.MockedClass<typeof ForumService>;
const MockedCommentRepository = CommentRepository as jest.MockedClass<typeof CommentRepository>;

defineFeature(feature, test=> {

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock User and Forum instances to be used in tests
        const mockUser = new User();
        mockUser.id = 1;
        mockUser.username = "johndoe";

        const mockForum = new Forum("Forum Title", "Forum Description", mockUser, null as any);
        mockForum.id = 3;
    })

    test('creating a comment', ({ given, and, when, then }) => {
        let context : any = {}
        given(/^i am logged as user with username "(.*)"$/, (arg0) => {
            context.username = arg0;
            // Create a mock user based on the username from the feature file
            const mockUser = new User();
            mockUser.id = 1;
            mockUser.username = context.username;
            context.user = mockUser;
        });

        and(/^i am at the Forum Page with ID "(.*)"$/, (arg0) => {
            context.forumId = parseInt(arg0, 10);
        });

        when(/^i create a new comment with the content "(.*)"$/, async (arg0) => {
            context.commentContent = arg0;
            
            const mockForum = new Forum("Forum Title", "Forum Description", context.user, null as any);
            mockForum.id = context.forumId;

            // The saved comment will have a proper `author` object
            const savedComment = new Comment(arg0, context.user, mockForum);
            savedComment.id = 1;

            jest.spyOn(MockedCommentRepository, 'save').mockResolvedValue(savedComment);
            
            // The ForumService should return a valid Forum object
            jest.spyOn(MockedForumService, 'getById').mockResolvedValue(mockForum);

            // This call still uses the simple DTO, which is what the service expects
            context.addedComment = await CommentService.add({
                'content': arg0,
                'username': context.username,
                'forumId': context.forumId // Corrected to use forumId
            });
        });

        then(/^a new comment must be created with "(.*)" as content and username "(.*)"$/, (arg0, arg1) => {
            expect(context.addedComment.content).toEqual(arg0);
            // The assertion now checks the username inside the author object
            expect(context.addedComment.author.username).toEqual(arg1);
        });
    });

    test('creating a comment without a username', ({ given, and, when, then }) => {
        let context : any = {}
        given('i am not logged in', () => {
            context.username = undefined;
        });

        and(/^i am at Forum Page with ID "(.*)"$/, (arg0) => {
            context.forumId = arg0;
        });

        when(/^i try to create a new comment with the content "(.*)"$/, (arg0) => {
            CommentService.add({
                'content': arg0,
                'username': context.username,
                'forumId': context.forumId // Corrected to use forumId
            }).catch((error) => {
                context.error = error;
            })
        });

        then('the comment is not created', () => {
            expect(MockedCommentRepository.save).not.toHaveBeenCalled();
        });

        and(/^shold raise a error saying that "(.*)"$/, (arg0) => {
            expect(context.error.message).toEqual(arg0);
        });
    });

    test('creating a comment without content', ({ given, and, when, then }) => {
        let context : any = {};
        given(/^i am logged as user with username "(.*)"$/, (arg0) => {
            context.username = arg0;
        });


        and(/^i am at Forum Page with ID "(.*)"$/, (arg0) => {
            context.forumId = arg0;
        });

        when('i try to create a new comment without the content', () => {
            CommentService.add({
                'content': undefined,
                'username': context.username,
                'forumId': context.forumId // Corrected to use forumId
            }).catch((error) => {
                context.error = error;
            });
        });

        then('the comment is not created', () => {
            expect(MockedCommentRepository.save).not.toHaveBeenCalled();
        });

        and(/^shold raise a error saying that "(.*)"$/, (arg0) => {
            expect(context.error.message).toEqual(arg0);
        });
    });


    test('creating a comment with a invalid forum', ({ given, and, when, then }) => {
        let context : any = {};
    	given(/^i am logged as user with username "(.*)"$/, (arg0) => {
            context.username = arg0;
    	});

    	and(/^i am at invalid Forum Page with ID "(.*)"$/, (arg0) => {
            context.forumId = arg0;
    	});

    	when(/^i try to create a new comment with the content "(.*)"$/, (arg0) => {
            jest.spyOn(MockedForumService, 'getById').mockResolvedValue(null);
            CommentService.add({
                'content': arg0,
                'username': context.username,
                'forumId': context.forumId // Corrected to use forumId
            }).catch((error) => {
                context.error = error;
            });
    	});

    	then('the comment is not created', () => {
            expect(MockedCommentRepository.save).not.toHaveBeenCalled();
    	});

    	and(/^shold raise a error saying that "(.*)"$/, (arg0) => {
            expect(context.error.message).toEqual(arg0);
    	});
    });

})