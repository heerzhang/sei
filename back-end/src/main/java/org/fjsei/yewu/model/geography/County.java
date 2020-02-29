package org.fjsei.yewu.model.geography;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;

//这一级别 可能省略掉。 街道上面--》地级市。

@Getter
@Setter
@NoArgsConstructor
@Entity
public class County {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    private String  name;        //+'县'、'区'； 独立市。
    //？某个市级单位，底下只有一个区。
    //市辖区和县级城市是同一个行政级别。 县底下能管的镇级市。
    //龙港市{原名字=苍南县龙港镇}=浙江省辖县级市，由温州市‘代管’？。
    //代管的应该不能算数，行政意义叫法。 国家一级的计划单列市{}，下面也有省一级的计划单列市；
    //代管的特殊情况太多了！！ 内蒙古自治区.呼伦贝尔{地级市}.满洲里市{计划单列市=准地级市，县级市也想管区呀}.扎赉诺尔区.6街道镇; ?太没谱了！。满洲里市应当当成区县。

    //平潭县()如何？
    //竟然是倒过来的关系：县的底下才是城市域。和中国相反了。在中国，市比县大；在美国，县比市大。
}
