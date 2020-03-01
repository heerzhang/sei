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
    //搜索匹配的名字， 不要太长了， 简单公用叫法的。
    private String  name;        //+'街道 '乡 '镇';
    //private int promote;    //缺省=0，  1表示区域管理级Grade提升了1级　;提升了就可以合并抹掉。
    //最低等级的行政区划。美国可能出现镇底下有市或县管市, 镇级别的市。

    //如果不需要根据Address反向级联查询People，可以注释掉
    //双向的1 ：1关系，关系是TSdnEnp类来维护；
    @OneToOne(mappedBy = "town")
    private Adminunit  ads;       //最小的区划单位，只能有一个了。
    //上级行政关系的关联：
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "county_id")
    private County  county;
    //没有 ： 下级行政关系的关联：
}

//“Town”“Township”,多数的Borough也是这个乡镇级别。
//美国比中国少了一个级别。=地区级别少了。