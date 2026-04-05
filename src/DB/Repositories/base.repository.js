export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  insertMany(data) {
    return this.model.insertMany(data);
  }

  updateOne(filter, update, options) {
    return this.model.updateOne(filter, update, options);
  }

  findOneAndUpdate(filter, update, options) {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  findByIdAndUpdate(id, update, options) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  findById(id) {
     return this.model.findById(id);
    
  }

    findOne(filter , select = {}) {
   return  this.model.findOne(filter || {}).select(select);
  } 

  find(filter) {
     return this.model.find(filter || {});
   
  }

  deleteOne(filter) {
    return this.model.deleteOne(filter || {});
  }

  deleteMany(filter) {
    return this.model.deleteMany(filter || {});
  }

  findOneAndDelete(filter) {
    return this.model.findOneAndDelete(filter || {});
  }
}
