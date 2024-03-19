//Những domain được truy cập tới server
export const WHITELIST_DOMAINS = []
// 'http://localhost:5173' (không cần locahost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev env.BUILD_MODE === 'dev')

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}