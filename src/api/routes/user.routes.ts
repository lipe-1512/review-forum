
import { Router, Request, Response } from 'express';
import { UserService } from '../../services/UserService';
import UserRepositoryClass from '../../repository/UserRepository';

const router = Router();
const userService = new UserService();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciamento de usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cadastro de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).send(user);
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticação do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 */
import jwt from 'jsonwebtoken';

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email e senha são obrigatórios.' });
    }
    const user = await UserRepositoryClass.findByEmail(email);
    if (!user) {
      return res.status(401).send({ message: 'Usuário não encontrado.' });
    }
    const isPasswordValid = await import('bcryptjs').then(bcrypt => bcrypt.compare(password, user.password));
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Senha incorreta.' });
    }
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );
    res.status(200).send({ message: 'Usuário autenticado com sucesso', token });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Atualização do perfil do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    const updateData = req.body;
    if (!userId) {
      return res.status(400).send({ message: 'ID do usuário é obrigatório para atualização.' });
    }
    const updatedUser = await userService.update(userId, updateData);
    res.status(200).send(updatedUser);
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Exclusão da conta do usuário
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 */
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    if (!userId) {
      return res.status(400).send({ message: 'ID do usuário é obrigatório para exclusão.' });
    }
    await userService.delete(userId);
    res.status(200).send({ message: 'Conta excluída com sucesso' });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/follow/{id}:
 *   post:
 *     summary: Seguir usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser seguido
 *     responses:
 *       200:
 *         description: Usuário seguido com sucesso
 */
router.post('/follow/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    const followId = parseInt(req.params.id, 10);
    if (!userId) {
      return res.status(400).send({ message: 'ID do usuário é obrigatório para seguir.' });
    }
    await userService.followUser(userId, followId);
    res.status(200).send({ message: `Seguindo usuário ${followId}` });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/unfollow/{id}:
 *   post:
 *     summary: Deixar de seguir usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser deixado de seguir
 *     responses:
 *       200:
 *         description: Usuário deixado de seguir com sucesso
 */
router.post('/unfollow/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    const unfollowId = parseInt(req.params.id, 10);
    if (!userId) {
      return res.status(400).send({ message: 'ID do usuário é obrigatório para deixar de seguir.' });
    }
    await userService.unfollowUser(userId, unfollowId);
    res.status(200).send({ message: `Deixou de seguir usuário ${unfollowId}` });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/lists/{listName}/add:
 *   post:
 *     summary: Adicionar item à lista pessoal
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: listName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da lista pessoal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item adicionado à lista com sucesso
 */
router.post('/lists/:listName/add', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    const listName = req.params.listName;
    const itemId = req.body.itemId;
    if (!userId || !itemId) {
      return res.status(400).send({ message: 'ID do usuário e itemId são obrigatórios.' });
    }
    await userService.addItemToList(userId, listName, parseInt(itemId, 10));
    res.status(200).send({ message: `Item adicionado à lista ${listName}` });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/lists/{listName}/remove:
 *   post:
 *     summary: Remover item da lista pessoal
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: listName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da lista pessoal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removido da lista com sucesso
 */
router.post('/lists/:listName/remove', async (req: Request, res: Response) => {
  try {
    const userId = req.body.id; // Assumindo que o ID do usuário vem no corpo da requisição
    const listName = req.params.listName;
    const itemId = req.body.itemId;
    if (!userId || !itemId) {
      return res.status(400).send({ message: 'ID do usuário e itemId são obrigatórios.' });
    }
    await userService.removeItemFromList(userId, listName, parseInt(itemId, 10));
    res.status(200).send({ message: `Item removido da lista ${listName}` });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /users/recover:
 *   post:
 *     summary: Recuperação de conta via e-mail
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link de recuperação enviado para o e-mail
 */
router.post('/recover', async (req: Request, res: Response) => {
  // Aqui você implementaria a lógica para recuperação de conta
  res.status(200).send({ message: 'Link de recuperação enviado para o e-mail' });
});

/**
 * @swagger
 * /users/history:
 *   get:
 *     summary: Visualizar histórico de avaliações e posts
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 */
router.get('/history', async (req: Request, res: Response) => {
  // Aqui você implementaria a lógica para retornar o histórico do usuário
  res.status(200).send({ evaluations: [], posts: [] });
});

export default router;
