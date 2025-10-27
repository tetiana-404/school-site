module.exports = (sequelize, DataTypes) => {
    const Medals= sequelize.define('Medals', {
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        gold: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '[]',
            get() {
                const rawValue = this.getDataValue('gold');
                return JSON.parse(rawValue || '[]');
            },
            set(value) {
                this.setDataValue('gold', JSON.stringify(value));
            },
        },
        silver: {
            type: DataTypes.TEXT, // також масив
            allowNull: false,
            defaultValue: '[]',
            get() {
                const rawValue = this.getDataValue('silver');
                return JSON.parse(rawValue || '[]');
            },
            set(value) {
                this.setDataValue('silver', JSON.stringify(value));
            },
        },
    }, {
        tableName: 'Medals'
    });

    return Medals;
};