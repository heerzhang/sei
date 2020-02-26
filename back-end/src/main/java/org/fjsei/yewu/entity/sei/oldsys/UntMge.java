package org.fjsei.yewu.entity.sei.oldsys;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TB_UNT_MGE",
        uniqueConstraints={@UniqueConstraint(columnNames={"UNT_ID"})} )
public class UntMge {
    @Id
    @Column(name = "UNT_ID")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    private String UNT_NAME;
    private String UNT_ADDR;      //'单位详细地址'
    private String UNT_ORG_COD;      //组织机构代码
    private String UNT_LKMEN;      //单位联系人
    private String UNT_MOBILE;      //单位联系人手机
    private String POST_COD;      //单位邮编
}