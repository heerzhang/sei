package org.fjsei.yewu.entity.sei.oldsys;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.fjsei.yewu.entity.sei.User;

import javax.persistence.*;
import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TB_EQP_MGE" )
public class EqpMge {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    //用JPA高级功能时会报错，JPA Repository规范要求的字段名：必须是小写头的，也不能用_号分割的。字段名尽量连续小写的变量。
    @Column(name = "EQP_COD")
    private String eQPCOD;
    private String OIDNO;
    private String EQP_USECERT_COD;     //'使用证号'
    private String EQP_STATION_COD;     //'设备代码
    private String EQP_NAME;            //'设备名称'=品种    EQP_VART_NAME
    private String EQP_VART_NAME;
    private String EQP_SORT;        //设备类别  EQP_SORT_NAME
    private String EQP_SORT_NAME;
    private String EQP_MOD;      //型号'
    private String FACTORY_COD;     //出厂编号；
    private String EQP_INNER_COD;     //单位内部编号'
    private Date MAKE_DATE;   //制造日期
    private Long USE_UNT_ID;      //使用单位ID  ,   USE_UNT_ADDR
    private Long SECUDEPT_ID;     //分支机构ID'
    private Long MAKE_UNT_ID;     //制造单位ID
    private Long ALT_UNT_ID;      //改造单位ID　　= -1
    private Long MANT_UNT_ID; //维保单位ID
    private Long BUILD_ID;    //'楼盘ID'
    private Date ALT_DATE;    //改造日期'
    private Date NEXT_ISP_DATE1;  //下次检验日期1（在线、年度）
    private Date NEXT_ISP_DATE2;  //下次检验日期2(机电定检，内检，全面）'
    //部分重复的属性。
    private String USE_UNT_ADDR;
    private String  EQP_USE_ADDR;    // '使用地点' 几号楼？
    // SAFE_MAN, SAFE_MAN_PHONE ;
    //WX_SIGNATURE;
}

//和旧平台的对接实体表。
