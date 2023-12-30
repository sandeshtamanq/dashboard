import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/gallery.dto';

import { generateSlug, removeFile } from '../@utils/utils';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(data: CreateGalleryDto) {
    const slug = generateSlug(data.title);

    const exists = await this.galleryRepository.findOne({ where: { slug } });
    if (exists)
      throw new BadRequestException('Gallery with this title already exists');

    if (data.images.length < 1)
      throw new BadRequestException('Gallery must have at least one image');

    const newGallery = new Gallery();
    newGallery.title = data.title;
    newGallery.slug = slug;
    newGallery.images = data.images.join(',');
    if (data.link) newGallery.link = data.link;
    if (data.description) newGallery.description = data.description;

    return this.galleryRepository.save(newGallery);
  }

  findManyAndCount(options: FindManyOptions<Gallery>) {
    return this.galleryRepository.findAndCount(options);
  }

  findAll() {
    return this.galleryRepository.find({});
  }

  async findOne(idOrSlug: number | string) {
    const data = await this.galleryRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!data)
      throw new NotFoundException("Gallery with this id or slug doesn't exist");

    return data;
  }

  async update(id: number, data: CreateGalleryDto) {
    const galleryItem = await this.findOne(id);

    // Images used in gallery
    const oldImages = [...galleryItem.images.split(',')];

    if (data.title) {
      galleryItem.title = data.title;
      galleryItem.slug = generateSlug(data.title);
    }
    if (data.link) galleryItem.link = data.link;
    if (data.images) galleryItem.images = data.images.join(',');
    if (data.description) galleryItem.description = data.description;

    const newData = await this.galleryRepository.save(galleryItem);

    // Removing images from file system that is no longer used..
    const newImages = [...galleryItem.images.split(',')];
    for (const img of oldImages) {
      if (!newImages.includes(img)) removeFile(img);
    }

    return newData;
  }

  async remove(id: number) {
    const galleryItem = await this.findOne(id);

    // Removing gallery itself
    await this.galleryRepository.delete(galleryItem.id);

    // Removing images from file system
    for (const img of galleryItem.images.split(',')) {
      removeFile(img);
    }
  }
}
