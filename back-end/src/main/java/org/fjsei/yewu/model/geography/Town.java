package org.fjsei.yewu.model.geography;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Town {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    //规范地址命名空间
    private String  name;        //+'街道 '乡 '镇';
    private int promote;    //缺省=0，  1表示区域管理级Grade提升了1级　;提升了就可以合并抹掉。
    private String  zipcode;
    //行政区划代码;350100 福州市; 350101 市辖区　350102 鼓楼区 350181 福清市　350182 长乐区市; 福建省350000;
    private String  area;         //地区码
    //最低等级的行政区划。美国可能出现镇底下有市或县管市, 镇级别的市。名字太高攀了吧。

    //如果不需要根据Address反向级联查询People，可以注释掉
    //双向的1 ：1关系，关系是TSdnEnp类来维护；
    @OneToOne(mappedBy = "town")
    private Adminunit  adu;
}

//“Town”“Township”,多数的Borough也是这个乡镇级别。
//美国比中国少了一个级别。=地区级别少了。
