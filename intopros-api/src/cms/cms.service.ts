import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';

import { Cms } from './entities/cms.entity';
import { CreateCmsDto } from './dto/cms.dto';

import { generateSlug, removeFile } from '../@utils/utils';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Cms) private readonly cmsRepository: Repository<Cms>,
  ) {}

  create(data: CreateCmsDto, userId: number) {
    const childs = [];
    for (let i = 0; i < (data.children ?? []).length; i++) {
      const item = (data.children ?? [])[i];

      const child = new Cms();
      child.title = item.title;
      child.slug = `block-${i + 1}`;
      child.description = item.description;
      child.image = item.image;

      childs.push(child);
    }

    const mainItem = new Cms();
    mainItem.title = data.title;
    mainItem.slug = generateSlug(data.title);
    mainItem.description = data.description;
    mainItem.image = data.image;
    mainItem.childPages = childs;
    if (data.metaDescription) mainItem.metaDescription = data.metaDescription;

    mainItem.creatorId = userId;

    return this.cmsRepository.save(mainItem);
  }

  findAllAndCount(options: FindManyOptions<Cms>) {
    return this.cmsRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Cms>) {
    return this.cmsRepository.find(options);
  }

  async findOneCMSBySlug(idOrSlug: string | number, filterBy?: string) {
    const data = await this.cmsRepository.findOne({
      where: {
        slug: idOrSlug,
        parentPageId: IsNull(),
        creatorId: Not(IsNull()),
        ...(filterBy === 'active'
          ? { isActive: true }
          : filterBy === 'inactive'
          ? { isActive: false }
          : {}),
      },
      relations: ['childPages', 'createdBy'],
    });

    if (!data) throw new NotFoundException("CMS page doesn't exist!");

    const { ...createdBy } = data?.createdBy;
    if (data?.createdBy) {
      return { ...data, createdBy };
    } else {
      return { ...data };
    }
  }

  async findOneCMSById(idOrSlug: number, filterBy?: string) {
    const data = await this.cmsRepository.findOne({
      where: {
        id: idOrSlug,
        parentPageId: IsNull(),
        creatorId: Not(IsNull()),
        ...(filterBy === 'active'
          ? { isActive: true }
          : filterBy === 'inactive'
          ? { isActive: false }
          : {}),
      },

      relations: ['childPages', 'createdBy'],
    });

    if (!data) throw new NotFoundException("CMS page doesn't exist!");

    const { ...createdBy } = data?.createdBy;
    if (data?.createdBy) {
      return { ...data, createdBy };
    } else {
      return { ...data };
    }
  }

  async findOne(idOrSlug: number) {
    const data = await this.cmsRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: ['childPages', 'createdBy'],
    });

    if (!data) throw new NotFoundException("CMS page doesn't exist!");

    const { ...createdBy } = data.createdBy;
    return { ...data, createdBy };
  }

  async update(id: number, data: CreateCmsDto) {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundException("CMS doesn't exist!");

    // Getting images that are associated with CMS before updating it
    const oldImgs = [
      item.image?.split(','),
      ...item.childPages.map((cp) => cp.image?.split(',')),
    ]
      ?.flat()
      ?.filter((img) => img && img !== '');

    if (data.title) {
      item.title = data.title;
      item.slug = generateSlug(data.title);
    }
    if ('image' in data) item.image = data.image;
    if ('isActive' in data) item.isActive = data.isActive;
    if (data.description) item.description = data.description;
    if (data.metaDescription) item.metaDescription = data.metaDescription;

    // Getting highest block count used
    let largestBlock = item.childPages.reduce((acc, curr) => {
      const count = parseInt(curr.slug.split('block-')[1]);
      if (isNaN(count)) return acc;

      return count > acc ? count : acc;
    }, 0);

    if ('children' in data) {
      const childrens: Cms[] = [];
      for (let i = 0; i < (data.children ?? []).length; i++) {
        const child = (data.children ?? [])[i];

        if (child.id) {
          const existingChild = item.childPages.find(
            (cp) => cp.id === child.id,
          );
          if (!existingChild) continue;

          existingChild.title = child.title;
          existingChild.slug = child.slug ?? `block-${++largestBlock}`;
          existingChild.description = child.description;
          existingChild.image = child.image ?? null;

          childrens.push(existingChild);
        } else {
          const childItemNew = new Cms();
          childItemNew.title = child.title;
          childItemNew.slug = child.slug ?? `block-${++largestBlock}`;
          childItemNew.description = child.description;
          childItemNew.image = child.image;

          childrens.push(childItemNew);
        }
      }

      const childrensToDelete = item.childPages.filter(
        (cp) => !childrens.find((c) => c.id === cp.id),
      );
      await this.cmsRepository.remove(childrensToDelete);

      item.childPages = childrens;
    }

    const savedData = await this.cmsRepository.save(item);

    // Getting new images that are still associated with the CMS
    const newImages = [
      savedData.image?.split(','),
      ...savedData.childPages.map((cp) => cp.image?.split(',')),
    ]
      ?.flat()
      ?.filter((img) => img && img !== '');

    // Removing every image that is no longer associated with the CMS
    for (const img of oldImgs) {
      if (!newImages.includes(img)) removeFile(img);
    }

    return savedData;
  }

  async remove(id: number) {
    const cmsItem = await this.cmsRepository.findOne({
      where: { id },
      relations: ['childPages'],
    });
    if (!cmsItem) throw new NotFoundException("CMS doesn't exist!");

    const allImages = [
      cmsItem.image?.split(','),
      ...cmsItem.childPages.map((cp) => cp.image?.split(',')),
    ]
      ?.flat()
      ?.filter((img) => img && img !== '');

    await this.cmsRepository.remove(cmsItem);

    // Removing images
    for (const img of allImages) {
      removeFile(img);
    }
  }
}
