package org.fjsei.yewu.model.geography;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.fjsei.yewu.entity.sei.EQP;
import org.springframework.security.access.prepost.PreAuthorize;

import javax.persistence.*;
import java.util.Set;

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
    @Column(length =256, unique = true)
    private String  name;    //'单位详细地址'
    //地址需要再次丰富掉， 省 市 区 镇 小区。
  //   private String  area;   //地区码 "zipCode": "",          area;   //地区码
    //UnitAddress 广域 1 : N Position 门牌栋号　+。
    private double lng;  //经度
    private double lat;  //纬度
    //楼盘小区 大厦名字，可另外并行独立出去。              String building;
    @OneToMany(mappedBy = "pos")
    private Set<EQP> eqps;

    //测试
    @PreAuthorize("hasRole('ADMIN')")
    public boolean setLngAndLat(String lng,String lat){
        this.lng=Double.parseDouble(lng);
        this.lat=Double.parseDouble(lat);
        return true;
    }

}

//能减少重复性录入的随意性，地址字符串实体化。 已经输入生成的就直接能选择关联旧的地址登记字符串。同时隐含地就选定了地区编码xxx_AREA_COD。
//旧平台设备表登记的EQP_USE_ADDR; '使用地点'==》 强化变成Address关联表。 原来是直接任意字符串字段。现在是签了ID的独立一个地址表，可重复性关联。
