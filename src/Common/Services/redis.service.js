import { redisClient } from "../Clients/index.js"


export const set = ( {key , value , options = {}})=>{
    return redisClient.set(key , value, optios)
}

export const get = ( {key })=>{
    return redisClient.get(key )
}

export const expire =({key, seconds})=>{
    return redisClient.expire(key ,seconds)
}

export const TTL =({key})=>{
    return redisClient.ttl(key)
}

export const del =({key})=>{
    return redisClient.del(key)
}