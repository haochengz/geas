
module.exports = schema => {
  schema.add({
    meta: {
      created: {
        type: Date,
        default: Date.now()
      },
      updated: {
        type: Date,
        default: Date.now()
      }
    }
  })
  
  schema.pre('save', function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = Date.now()
    } else {
      this.meta.updated = Date.now()
    }
    return next()
  })
}
