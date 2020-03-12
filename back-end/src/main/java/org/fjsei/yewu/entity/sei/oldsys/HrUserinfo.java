package org.fjsei.yewu.entity.sei.oldsys;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;

//旧平台用户登录。

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TB_USER_INFO",  schema="HRUSER",
        uniqueConstraints={@UniqueConstraint(columnNames={"USER_ID"})} )
public class HrUserinfo {
    @Id
    @Column(name = "USER_ID", insertable=false, updatable=false)
    protected String  userId;        //账号ID

    @Column(name = "PWD")
    private String  password;      //明文密码
    @Column(name = "USER_STATUS")
    private Integer  status;       //=2
}

//对于Orcacle多用户schema分开的表。 @Table(name = "TB_USER_INFO",  schema="HRUSER",；不能直接写"HRUSER.TB_USER_INFO"
//@Column( columnDefinition表示创建表时，SQL语句，一般用于通过Entity生成表（DB中表已经建好，该属性没有必要）
