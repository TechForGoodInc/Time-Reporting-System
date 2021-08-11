/*
 * This is just a normal Javascript object that is used to carry the data around from Componets to App.js
 * date should be a Date object - new Date()
 * hours should be a float
 * description should be a string
 * project should be a string
 * */

export default class entryData {
    constructor(date, hours, description, project) {
        this.date = date;
        this.hours = hours;
        this.description = description;
        this.project = project;
    }
};