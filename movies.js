const z = require('zod');

const movieSchema = z.object({
  title: z.string(),
  year: z.number().int().min(1920).max(2040),
  director: z.string(),
  duration: z.number(),
  poster: z.string().url().endsWith('.jpg'),
  genre: z.array(
    z.enum(['Action','Comedy','Sci-Fi','Romance','Drama','Biography','Terror','Thriller','Dream','Mystery'],{
      message:'Please, select one of the genre from the list'
    })
  ),
  rate: z.number().min(0).max(10)
})

function validateMovie(object){
  return movieSchema.safeParse(object);
}

function updateMovie(object){
  return movieSchema.partial().safeParse(object);
}

module.exports = {
    validateMovie,
    updateMovie
}