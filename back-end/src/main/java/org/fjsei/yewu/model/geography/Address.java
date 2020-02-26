package org.fjsei.yewu.model.geography;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    //用户地址命名空间
    private String  detail;    //'单位详细地址'
    //地址需要再次丰富掉， 省 市 区 镇 小区。
  //   private String  area;   //地区码 "zipCode": "",
    //UnitAddress 广域 1 : N Position 门牌栋号　+。
    private double lng;  //经度
    private double lat;  //纬度
    //楼盘小区 大厦名字，可另外并行独立出去。
}