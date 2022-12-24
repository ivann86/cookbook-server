import { NextFunction, Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import slug from 'slug';
import { ValidationError } from '../../errors';
import { ApplicationError } from '../../errors/application.error';
import { makeResponseBody, removeImages, saveImages } from '../utils';
import { parseStringifiedParams } from '../utils/body.utils';

declare global {
  interface RecipesController {
    addRecipe: RequestHandler;
    patchRecipe: RequestHandler;
    getAll: RequestHandler;
    getById: RequestHandler;
    getBySlug: RequestHandler;
    getTagSample: RequestHandler;
    upload: RequestHandler;
    removeRecipe: RequestHandler;
  }
}

export function recipesController(recipes: RecipesCollection): RecipesController {
  const PORT = process.env.ACCESS_PORT || '';
  const multerStorage = multer.memoryStorage();
  const upload = multer({ storage: multerStorage, limits: { fileSize: 2 * 1024 * 1024 } }).single('image');

  async function addRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const body = parseStringifiedParams(req.body);
      const nameSlug = slug(body.name);

      let images = { imgUrl: body.imgUrl, imgSmallUrl: body.imgSmallUrl || body.imgUrl };
      if (req.file) {
        images = await saveImages(nameSlug, req.file);
      }

      const result = await recipes.add(Object.assign({}, body, { slug: nameSlug, owner: req.user?.id }, images));

      res.status(201).json(makeResponseBody({ recipe: Object.assign(result, images) }));
    } catch (err) {
      if ((err as any)?.code === 'LIMIT_FILE_SIZE') {
        err = new ValidationError('Maximum allowed image size is 2MB');
      }
      next(err);
    }
  }

  async function patchRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await recipes.getBySlug(req.params.slug, {});

      if ((existing.owner as User).id !== req.user!.id) {
        throw new ApplicationError('AuthorizationError', 'You are not authorized to edit this recipe');
      }

      const body = Object.assign(req.body, parseStringifiedParams(req.body));
      body.slug = slug(body.name || '') || req.params.slug;
      let images = { imgUrl: body.imgUrl, imgSmallUrl: body.imgSmallUrl || body.imgUrl };

      if (req.file) {
        images = await saveImages(body.slug, req.file);
      }

      // Hack
      existing.owner = (existing.owner as User).id;
      const updated = Object.assign({}, existing, body, images);
      await recipes.update(req.params.slug, updated);
      res.status(201).json(makeResponseBody({ recipe: updated }));
    } catch (err) {
      next(err);
    }
  }

  async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let owner = (req.query.owner as string | undefined)?.trim();
      let country = (req.query.country as string | undefined)?.trim();
      let search = (req.query.search as string | undefined)?.trim() || '';
      let tags = (req.query.tags as string | undefined)
        ?.split(',')
        .map((tag) => tag.trim())
        .filter((tag) => !!tag);
      let limit = +(req.query.limit || 20) || 20;
      if (limit < 1 || limit > 60) {
        limit = 20;
      }
      const filter: any = {};
      if (owner) {
        filter.owner = owner;
      }
      if (country) {
        filter.country = country;
      }
      if (tags?.length) {
        filter.tags = tags;
      }
      let sort;
      if (req.query.sort) {
        const order = parseInt((req.query.order as string) || '1') || 1;
        sort = [{ [req.query.sort as string]: order }];
      }
      let page = Math.abs(+(req.query.page || 1) || 1);
      let skip = (page - 1) * limit;
      const total = await recipes.count(search, filter);
      let results;
      if (search) {
        results = await recipes.search(search, { limit, skip, sort });
      } else {
        results = await recipes.get(filter, { limit, skip, sort });
      }

      res.status(200).json(makeResponseBody({ total, limit, page, count: results.length, items: results }));
    } catch (err) {
      next(err);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const recipe = await recipes.getById(req.params.id, {});
      res.status(200).json(makeResponseBody({ recipe }));
    } catch (err) {
      next(err);
    }
  }

  async function getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const recipe = await recipes.getBySlug(req.params.slug, {});
      res.status(200).json(makeResponseBody({ recipe }));
    } catch (err) {
      next(err);
    }
  }

  async function getTagSample(req: Request, res: Response, next: NextFunction) {
    try {
      const tags =
        (req.query.tags as string | undefined)
          ?.split(',')
          .map((tag) => tag.trim())
          .filter((tag) => !!tag) || [];
      const size = +(req.query.limit || 3);
      const count = await recipes.count('', {});
      const results = await recipes.getTagSample(tags, size);
      res.status(200).json(makeResponseBody({ total: count, count: size, items: results }));
    } catch (err) {
      next(err);
    }
  }

  async function removeRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const recipe = await recipes.getBySlug(req.params.slug, {});

      if ((recipe.owner as User).id !== req.user!.id) {
        throw new ApplicationError('AuthorizationError', 'You are not authorized to delete this recipe');
      }

      await recipes.remove({ slug: recipe.slug });
      await removeImages(recipe.imgUrl);
      res.status(200).json(makeResponseBody({}));
    } catch (err) {
      next(err);
    }
  }

  return Object.freeze({
    addRecipe,
    patchRecipe,
    getAll,
    getById,
    getBySlug,
    getTagSample,
    upload,
    removeRecipe,
  });
}
