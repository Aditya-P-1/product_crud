const {
  errorResponse
} = require("../utils/apiResponse")



const validate = (
  schema,
  source = "body"
) => {

  return (req, res, next) => {

    try {

      schema.parse(req[source])

      next()

    } catch (error) {

      const errors = error.issues.map(
        (err) => ({
          field: err.path[0],
          message: err.message
        })
      )

      return errorResponse(
        res,
        400,
        "Validation failed",
        errors
      )
    }
  }
}

module.exports = validate