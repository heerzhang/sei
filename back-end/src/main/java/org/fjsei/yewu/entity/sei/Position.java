package org.fjsei.yewu.entity.sei;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.access.prepost.PreAuthorize;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;

    @Column(length =256, unique = true)
    private String  address;
    //地址需要再次丰富掉， 省 市 区 镇 小区。
    private String  area;   //地区码
    //UnitAddress 广域 1 : N Position 门牌栋号　+。
    private double lng;  //经度
    private double lat;  //纬度

    private String building;

    @OneToMany(mappedBy = "pos")
    private Set<EQP> eqps;

    public  Position(String address,String area,String building){
       // super();
        this.address=address;
        this.area=area;
        this.building=building;
      //  eqps=null;
    }
    //测试
    @PreAuthorize("hasRole('ADMIN')")
    public boolean setLngAndLat(String lng,String lat){
        this.lng=Double.parseDouble(lng);
        this.lat=Double.parseDouble(lat);
        return true;
    }

}

