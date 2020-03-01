package org.fjsei.yewu.model.geography;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import java.util.Set;

//聚合表;
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
    //旧平台 ， 外部地理系统的对接的 地区码。
    //行政区划代码9位数字;350100 福州市; 350101 市辖区　350102 鼓楼区 350181 福清市　350182 长乐区市; 福建省350000;
    private String  areacode;
    //邮政编码；
    private String  zipcode;

    @OneToMany(mappedBy = "ad")
    private Set<Address>  adrs;
    //行政区划4个等级+1的； 用于提高搜索判定速度。
    //1:1关联； Adminunit本id对应Town的ID； 本来应当这张表添加1:1关联id字段。
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
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private Province  province;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country  country;
}

/*
行政区划代码代码从左至右的含义是：第一、二位表示省（自治区、直辖市、特别行政区）、第三、四位表示市（地区、自治州、盟及国家直辖市所属市辖区和县的汇总码）、
第五、六位表示县（市辖区、县级市、旗）、第七至九位表示乡、镇（街道办事处）。
邮政编码6位数编码,前两位数字表示省（直辖市、自治区）；前三位数字表示邮区；前四位数字表示县（市）；最后两位数字表示投递局（所）。
*/