package org.fjsei.yewu.entity.sei.oldsys;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TB_ELEV_PARA",
        uniqueConstraints={@UniqueConstraint(columnNames={"EQP_COD"})} )
public class ElevPara {

    //用JPA高级功能时会报错，JPA Repository规范要求的字段名：必须是小写头的，也不能用_号分割的。字段名尽量连续小写的变量。
    @Id
    @Column(name = "EQP_COD")
    private String eqpcod;

    //'控制方式@[{id:''按钮'',text:''按钮''},{id:''信号'',text:''信号''},{id:''集选'',text:''集选''},{id:''并联'',text:''并联''},{id:''群控'',text:''群控''}]'
    private String CONTROL_TYPE;
    private int ELEFLOORNUMBER;     //'电梯层数'
    private int ELESTADENUMBER;     // '电梯站数'
    private int ELEDOORNUMBER;  //    is '电梯门数'
    private float  RUNVELOCITY;      //    is '运行速度(m/s)
    private double  RATEDLOAD;       //   is '额定载荷(kg) .

}


/*
      <name>ASSISPMEN</name>
      <value><![CDATA[孙传景,詹洪亮,]]></value>
    </equipinfo>
     <name>REP_TYPE</name>
      <value><![CDATA[300011]]></value>
    </equipinfo>
    <equipinfo>
      <name>REP_NAME</name>
      <value><![CDATA[有机房曳引驱动电梯定期检验]]></value>
    </equipinfo>
    <equipinfo>
      <name>repmoduleId</name>
      <value><![CDATA[FJB/TC-1001-1-0-2017]]></value>
    </equipinfo>
    <equipinfo>
      <name>JLRZ_COD</name>
      <value><![CDATA[181320110160]]></value>
    </equipinfo>
    <equipinfo>
      <name>JLRZ_DATE</name>
      <value><![CDATA[ ]]></value>
    </equipinfo>
    <equipinfo>
      <name>MECH_APPR_COD</name>
      <value><![CDATA[机构核准证号：TS7110236-2022]]></value>
*/

//和旧平台的对接实体表。
