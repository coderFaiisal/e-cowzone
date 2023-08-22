import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (cow: ICow) => {
  const isExist = await Cow.findOne(cow);

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'This cow already exist!');
  } else {
    const result = (await Cow.create(cow)).populate('seller');
    return result;
  }
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: Partial<IPaginationOptions>,
): Promise<IGenericResponse<ICow[]>> => {
  //implement sort conditions
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(paginationOptions);
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  //implement search and filter query
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andConditions = [];

  if (minPrice) {
    andConditions.push({
      price: { $gte: Number(minPrice) },
    });
  }

  if (maxPrice) {
    andConditions.push({
      price: { $lte: Number(maxPrice) },
    });
  }

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditons =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditons)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller');

  const total = await Cow.countDocuments(whereConditons);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const { ...updatedData } = payload;

  const isExist = await Cow.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is not found!');
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  }).populate('seller');
  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is not found!');
  }

  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowService = {
  createCow,
  getSingleCow,
  getAllCows,
  updateCow,
  deleteCow,
};
