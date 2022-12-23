const Errors = {

    //Project : 0
    PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
    PROJECT_NOT_YOURS: "PROJECT_NOT_YOURS",

    //Collaboration : 1
    COLLABORATION_NOT_FOUND: "COLLABORATION_NOT_FOUND",
    COLLABORATION_ALREADY_EXISTS: "COLLABORATION_ALREADY_EXISTS",
    COLLABORATION_NOT_LINKED_TO_PROJECT: "COLLABORATION_NOT_LINKED_TO_PROJECT",
    COLLABORATION_CANT_BE_CHANGED_YOURS: "COLLABORATION_CANT_BE_CHANGED_YOURS",

    //Custom errors : 2
    INTERNAL_ERROR: "INTERNAL_ERROR",
    BAD_REQUEST_MISSING_INFOS: "BAD_REQUEST_MISSING_INFOS",
    BAD_REQUEST_BAD_INFOS: "BAD_REQUEST_BAD_INFOS",
    CANT_GIVE_OWNER_AT_CREATION: "CANT_GIVE_OWNER_AT_CREATION",
    EMAIL_UNKNOWN: "EMAIL_UNKNOWN",

    //Rights : 3
    ROLE_UNAUTHORIZED: "ROLE_UNAUTHORIZED",

    //User : 4
    USER_NOT_LOGIN: "USER_NOT_LOGIN",
    USER_ALREADY_LOGIN: "USER_ALREADY_LOGIN",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    EMAIL_ALREADY_USED: "EMAIL_ALREADY_USED",
    INVALID_PASSWORD: "INVALID_PASSWORD",

    LIST_NOT_FOUND: "LIST_NOT_FOUND",
    LIST_NOT_YOURS: "LIST_NOT_YOURS",
    PROJECT_LISTED_NOT_FOUND: "PROJECT_LISTED_NOT_FOUND",
    PROJECT_LISTED_ALREADY_EXISTS: "PROJECT_LISTED_ALREADY_EXISTS",
    LIST_MEMBER_ALREADY_EXISTS: "LIST_MEMBER_ALREADY_EXISTS",
    LIST_MEMBER_NOT_FOUND: "LIST_MEMBER_NOT_FOUND",
    LIST_MEMBER_CANT_BE_CHANGED_YOURS: "LIST_MEMBER_CANT_BE_CHANGED_YOURS",

    //Image : 6
    IMAGE_NOT_FOUND: "IMAGE_NOT_FOUND",
    IMAGE_NOT_YOURS: "IMAGE_NOT_YOURS",

    //Video : 9
    VIDEO_NOT_FOUND: "VIDEO_NOT_FOUND",
    VIDEO_NOT_YOURS: "VIDEO_NOT_YOURS",

    //Replica : 7
    REPLICA_NOT_FOUND: "REPLICA_NOT_FOUND",
    REPLICA_NOT_IN_PROJECT: "REPLICA_NOT_IN_PROJECT",
    REPLICA_AND_AUDIO_CREATION_MISSING_ARGUMENTS: "REPLICA_AND_AUDIO_CREATION_MISSING_ARGUMENTS",

    //ReplicaComment :
    REPLICACOMMENT_NOT_FOUND: "REPLICACOMMENT_NOT_FOUND",

    //Shop : 8
    ARTICLE_NOT_FOUND: "ARTICLE_NOT_FOUND",
    CART_NOT_FOUND: "CART_NOT_FOUND",

    ERROR_S3_DELETE: "ERROR_S3_DELETE",
};

exports.Errors = Errors;