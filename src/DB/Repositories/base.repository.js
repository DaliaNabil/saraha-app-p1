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

  findOne(filter, select = {}) {
    return this.model.findOne(filter || {}).select(select);
  }

  find(filter) {
    return this.model.find(filter || {});
  }

  deleteOne(filter) {
    return this.model.deleteOne(filter || {});
  }

  findOneAndDelete(filter) {
    return this.model.findOneAndDelete(filter || {});
  }

  updateWithFindById(id, update, options) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteAll() {
    return this.model.deleteMany({});
  }

  deleteMany(filter, options = {}) {
    const { session, ...otherOptions } = options;
    const query = this.model.deleteMany(filter || {}, otherOptions);
    if (session) {
      return query.session(session);
    }
    return query;
  }

  findByIdAndDelete(_id, options = {}) {
    const { session, ...otherOptions } = options;
    const query = this.model.findByIdAndDelete(_id, otherOptions);
    if (session) {
      return query.session(session);
    }
    return query;
  }

  countDocuments(filters) {
    return this.model.countDocuments(filters);
  }
}
