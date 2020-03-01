package org.fjsei.yewu.model.geography;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import java.util.Set;

//最小的行政单位;  数据库搜索查询基础对象。

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Adminunit {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    //前缀行政地理描述部分， 规范地址命名空间
    private String  prefix;   //街道'乡'镇';但允许街道名称省略掉。 鼓楼区就行，不一定要加上街道称呼。
    //邮政编码；
    private String  zipcode;
    //旧平台 ， 外部地理系统的对接的 地区码。
    //行政区划代码;350100 福州市; 350101 市辖区　350102 鼓楼区 350181 福清市　350182 长乐区市; 福建省350000;
    private String  areacode;

    @OneToMany(mappedBy = "ad")
    private Set<Address>  adrs;
    //行政区划4个等级+1的； 用于提高搜索判定速度。
    //1:1关联T_EBM_USER.userId
    //1 ：1关系，关系是本类来维护，添加外键指向对方实体表的主键；
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ID", referencedColumnName = "ID")
    private Town  town;         //最小的1:1关系。
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "county_id")
    private County  county;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City  city;

    private Province  province;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country  country;
}
//最低等级的行政区划。
