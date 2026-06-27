const mongoose = require('mongoose');

module.exports = function softDeletePlugin(schema, options) {
    schema.add({
        deletedAt: { type: Date, default: null },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
        deletedReason: { type: String, default: null, trim: true },
        restoredAt: { type: Date, default: null }
    });

    // Override the standard find methods to exclude soft-deleted documents by default
    const typesFindQueryMiddleware = [
        'count',
        'countDocuments',
        'find',
        'findOne',
        'findOneAndDelete',
        'findOneAndRemove',
        'findOneAndUpdate',
        'update',
        'updateOne',
        'updateMany',
    ];
    const excludeDeleted = function(next) {
        // If the query explicitly asks for deletedAt, don't override it (allows querying the trash)
        if (this.getQuery && typeof this.getQuery === 'function') {
            const query = this.getQuery();
            if (query && query.deletedAt === undefined) {
                this.where({ deletedAt: null });
            }
        }
        if (typeof next === 'function') {
            next();
        }
    };

    typesFindQueryMiddleware.forEach((type) => {
        schema.pre(type, excludeDeleted);
    });

    // Instance method for soft delete
    schema.methods.softDelete = function(adminId, reason) {
        this.deletedAt = new Date();
        if (adminId) this.deletedBy = adminId;
        if (reason) this.deletedReason = reason;
        return this.save();
    };

    // Instance method for restore
    schema.methods.restore = function() {
        this.deletedAt = null;
        this.deletedBy = null;
        this.deletedReason = null;
        this.restoredAt = new Date();
        return this.save();
    };
};
