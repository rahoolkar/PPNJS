class myError extends Error{
    constructor(status,messege){
        super();
        this.status = status;
        this.messege = messege;
    }
}

module.exports = myError;