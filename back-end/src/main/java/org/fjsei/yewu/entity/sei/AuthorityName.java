package org.fjsei.yewu.entity.sei;

//关联靠id;而这里权限的名字和id对应关系很关键，
//要 ROLE_  开头的；
//注意！ id不应该随着AuthorityName的增删改而导致ID变动。  看Table( AUTHORITY )
//AUTHORITY表，不会从AuthorityName这自动增删改的。
//Authority需要人工匹配enum AuthorityName的数据。

public enum AuthorityName {
    ROLE_SOMEONE,
    ROLE_USER,
    ROLE_ADMIN,
    ROLE_Manager
}


