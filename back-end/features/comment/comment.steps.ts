import { defineFeature, loadFeature } from "jest-cucumber";
import CommentService from "src/services/CommentService";
import ForumService from "src/services/ForumService";
import CommentRepository from "src/repository/CommentRepository";
const feature = loadFeature("features/comment/comment.feature");

const MockedCommentService = CommentService as jest.MockedClass<typeof CommentService>;
const MockedForumService = ForumService as jest.MockedClass<typeof ForumService>;
const MockedCommentRepository = CommentRepository as jest.MockedClass<typeof CommentRepository>;

defineFeature(feature, test=> {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('creating a comment', ({ given, and, when, then }) => {
        let context : any = {}
        given(/^i am logged as user with username "(.*)"$/, (arg0) => {
            context.username = arg0;
        });

        and(/^i am at the Forum Page with ID "(.*)"$/, (arg0) => {
            context.forumId = arg0;
        });

        when(/^i create a new comment with the content "(.*)"$/, async (arg0) => {
            context.commentContent = arg0;

            jest.spyOn(MockedCommentRepository, 'save').mockResolvedValue({
                id: 1,
                content: "Cool film, liked",
                username: context.username,
                forum: {
                    'id': context.forumId
                }, 
                forumId: context.forumId,
                isEdited: false
            })

            jest.spyOn(MockedForumService, 'getById').mockResolvedValue({
                id: context.forumId,
                title: "Forum Title",
                description: "Forum Description",
                related_movie: {
                    id: 1,
                    name: "Movie Title",
                    created_at: new Date(),
                    description: ""
                },
                username: 'asdsada',
                created_at: new Date(),
                updated_at: new Date()
            })

            context.addedComment = await CommentService.add({
                'content': arg0,
                'username': context.username,
                'forum': context.forumId
            })
        });

        then(/^a new comment must be created with "(.*)" as content and username "(.*)"$/, (arg0, arg1) => {
            expect(context.addedComment.content).toEqual(arg0)
            expect(context.addedComment.username).toEqual(arg1);
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
                'forum': context.forumId
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
                'forum': context.forumId
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
                'forum': context.forumId
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