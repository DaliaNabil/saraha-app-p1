import { application } from "express";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  GUEST: "guest",
};

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
};

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH : "refresh",
}

export const PROVIDERS = {
  SYSTEM: "system",
  GOOGLE: "google",   
  FACEBOOK: "facebook",
  APPLE: "apple", 
}

export const fileExtensions={
    image:['jpg', 'jpeg' ,'png' ,'gif'],
    vido:['mp4', 'avi', 'mkv','mov'] ,
    application:['pdf', 'doc','docx']

}

export const CHANNELS ={
    EMAIL:'email',
    PHONE:'phone'
}