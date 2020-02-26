package org.fjsei.yewu.model.geography;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    private String  name;        //+',市' '洲？' ,行政级别：？‘xx实验区’； 旧的地区级区域
    //‘香港’‘上海市’ 如何呢： 省 市 都是同一个。 两个实体表都有的。
    //特殊例外的 标志位。
    private int promote;    //缺省=0，  1表示区域管理Grade提升了1级。
}