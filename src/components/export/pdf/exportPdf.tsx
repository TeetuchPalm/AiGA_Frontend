import React, { ReactElement } from "react"
import {
  Chart as ChartJS,
} from 'chart.js';
import ReactPDF, { Document, Font, Image, Page, Path, StyleSheet, Svg, Text, View, pdf } from "@react-pdf/renderer"
import { IHistoryResponse } from "../../../interfaces/history/History"
import html2canvas from "html2canvas"
import "./exportPdf.scss"
import { saveAs } from "file-saver"
import notoSansThai from "../../../assets/fonts/NotoSansThai-Regular.ttf"
import notoSansThaiBold from "../../../assets/fonts/NotoSansThai-Bold.ttf"
interface IProps {
  pictureOne: React.RefObject<ChartJS | null>
  pictureTwo: React.RefObject<ChartJS | null>
  pictureThreeResearch: React.RefObject<ChartJS | null> | null
  pictureFourResearch: React.RefObject<ChartJS | null> | null
  pictureThree: React.RefObject<HTMLDivElement | null> | null
  pictureFour: React.RefObject<HTMLDivElement | null> | null
  abnormalRange: React.RefObject<HTMLDivElement | null> | null
  history: IHistoryResponse | undefined
  sendIsLoading: (isLoading: boolean) => void
  disable: boolean
}

function ExportPdf({ pictureOne, pictureTwo, pictureThree, pictureFour, abnormalRange, history, sendIsLoading, disable, pictureThreeResearch, pictureFourResearch }: IProps): ReactElement {
  Font.register({
    family: "NotoSansThai",
    fonts: [
      {
        src: notoSansThai,
        fontWeight: 400,
      },
      {
        src: notoSansThaiBold,
        fontWeight: 900,
      },
    ],
  })

  const styles: ReactPDF.Styles = StyleSheet.create({
    page: {
      paddingTop: 25,
      paddingBottom: 25,
      paddingHorizontal: 35,
    },
    logo: {
      fontFamily: 'NotoSansThai',
      fontSize: 29,
      textAlign: 'center',
      fontWeight: 900
    },
    title: {
      fontFamily: 'NotoSansThai',
      fontSize: 18,
      textAlign: 'center',
      textDecoration: 'underline',
      fontWeight: 900
    },
    image: {
      width: 510,
      marginTop: 5
    },
    imageTable: {
      width: 400,
      marginTop: 5
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    patientHeader: {
      fontFamily: 'NotoSansThai',
      marginTop: 10,
      fontSize: 16,
      textDecoration: 'underline',
      fontWeight: 900
    },
    AnalyticHeader: {
      fontFamily: 'NotoSansThai',
      marginTop: 10,
      fontSize: 16,
      marginBottom: 10,
      textDecoration: 'underline',
      fontWeight: 900
    },
    patientPart: {
      fontFamily: 'NotoSansThai',
      marginTop: 10,
      fontSize: 14,
      marginBottom: 3,
      fontWeight: 400
    },
    patientText: {
      fontFamily: 'NotoSansThai',
      fontSize: 10,
      marginRight: 20,
      width: 300,
      fontWeight: 400
    },
    graphLabel: {
      fontFamily: 'NotoSansThai',
      fontSize: 14,
      fontWeight: 400
    },
    rowPatient: {
      display: 'flex',
      flexDirection: 'row',
    },
    abnormalRange: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    imageAbnormalRange: {
      width: 700,
    },
    middle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    }
  })

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.logo}>AIGA</Text>
        <Text style={styles.title}>TEST REPORT</Text>
        <Text style={styles.patientHeader}>Patient Information</Text>
        <Text style={styles.patientPart}>Part 1 : General Information</Text>
        <Text style={styles.patientText}>Patient ID: {history?.patient.id || ""}</Text>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Firstname: {history?.patient.firstname || ""}</Text>
          <Text style={styles.patientText}>Surname: {history?.patient.lastname || ""}</Text>
        </View>
        <Text style={styles.patientText}>Gender: {history?.patient.gender ? 'Male' : 'Female' || ""}</Text>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Date of Birth: {history?.patient.dob || ""}</Text>
          <Text style={styles.patientText}>Age: {calculateAge(history?.patient.dob)}</Text>
        </View>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Weight (kg): {history?.patient.weight || ""}</Text>
          <Text style={styles.patientText}>Height (cm): {history?.patient.height || ""}</Text>
        </View>
        <Text style={styles.patientPart}>Part 2 : Medical Information</Text>
        <Text style={styles.patientText}>Amputated leg: {history?.patient.amputatedLeg || ""}</Text>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Residual limb length: {
            history?.patient.residualLimbLength === 0 ? "Short stump length" :
              history?.patient.residualLimbLength === 1 ? "Medium stump length" : "Long stump length" || ""
          }</Text>
          <Text style={styles.patientText}>Residual limb shape: {history?.patient.residualLimbShape || ""}</Text>
        </View>
        <Text style={styles.patientText}>Functional level: {history?.patient.functionalLevel || ""}</Text>
        <Text style={styles.patientText}>Underlying disease: {history?.patient.underlyingDisease || "-"}</Text>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Range of motion: {history?.patient.rangeOfMotion ? "Yes" : "No"}</Text>
          <Text style={styles.patientText}>Muscle strength: {history?.patient.muscleStrength ? "Yes" : "No"}</Text>
        </View>
        <Text style={styles.patientPart}>Part 3 : Prosthetic Information</Text>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Structure: {history?.patient.prosthesisStructure}</Text>
          <Text style={styles.patientText}>Socket: {history?.patient.prosthesisSocket}</Text>
        </View>
        <View style={[styles.rowPatient]}>
          <Text style={styles.patientText}>Liner: {history?.patient.prosthesisLinear}</Text>
          <Text style={styles.patientText}>Suspension: {history?.patient.prosthesisSuspension}</Text>
        </View>
        <Text style={styles.patientText}>Foot: {history?.patient.prosthesisFoot}</Text>
      </Page>
      <Page size="A4" style={styles.page}>
      <Text style={styles.logo}>AIGA</Text>
        <Text style={styles.title}>TEST REPORT</Text>
        <Text style={styles.AnalyticHeader}>Analytics Result For {abnormalRange ? 'Clinician' : 'Researcher'}</Text>
        <View>
          <View>
            {abnormalRange ? <Text style={styles.graphLabel}>Graph Knee:</Text> : <Text style={styles.graphLabel}>Graph Knee Left:</Text>}
            <Image
              style={styles.image}
              source={getPictureFromGraph(pictureOne.current)}
            />
          </View>
          <View>
            {abnormalRange ? <Text style={styles.graphLabel}>Graph Hip:</Text> : <Text style={styles.graphLabel}>Graph Knee Right:</Text>}
            <Image
              style={styles.image}
              source={getPictureFromGraph(pictureTwo.current)}
            />
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
      <Text style={styles.logo}>AIGA</Text>
        <Text style={styles.title}>TEST REPORT</Text>
        <Text style={styles.AnalyticHeader}>Analytics Result For {abnormalRange ? 'Clinician' : 'Researcher'}</Text>
        {pictureThree && pictureFour && <View>
          <View>
            <Text style={styles.graphLabel}>Table Left Leg:</Text>
            <View style={styles.middle}>
            <Image
              style={styles.imageTable}
              src={getPictureFromCanvas(pictureThree.current)}
            />
            </View>
            {abnormalRange && <View style={styles.abnormalRange}>
          <Image
            style={styles.imageAbnormalRange}
            src={getPictureFromCanvas(abnormalRange.current)}
          />
        </View>}
          </View>
          <View>
            <Text style={styles.graphLabel}>Table Right Leg:</Text>
            <View style={styles.middle}>
            <Image
              style={styles.imageTable}
              src={getPictureFromCanvas(pictureFour.current)}
            />
            </View>
          </View>
        </View>}
        {pictureThreeResearch && pictureFourResearch && <View>
          <View>
            <Text style={styles.graphLabel}>Graph Hip Left:</Text>
            <Image
              style={styles.image}
              src={getPictureFromGraph(pictureThreeResearch.current)}
            />
          </View>
          <View>
            <Text style={styles.graphLabel}>Graph Hip Right:</Text>
            <Image
              style={styles.image}
              src={getPictureFromGraph(pictureFourResearch.current)}
            />
          </View>
        </View>}
        {abnormalRange && <View style={styles.abnormalRange}>
          <Image
            style={styles.imageAbnormalRange}
            src={getPictureFromCanvas(abnormalRange.current)}
          />
        </View>}
      </Page>
    </Document>
  )

  const calculateAge = (dobString: string | undefined): string => {
    if (dobString) {
      const dob = new Date(dobString)
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      return age.toString()
    } else {
      return ""
    }
  }

  const getPictureFromGraph = (element: ChartJS | null): string => {
    if (element) {
      element!!.resize(718, 400)
      const image: string = element!!.toBase64Image()
      element!!.resize()
      return image
    } else {
      return ''
    }
  }

  const getPictureFromCanvas = async (element: HTMLDivElement | null): Promise<string> => {
    if (element) {
      const image = await html2canvas(element, {
        logging: false,
        windowWidth: 1519
      }).then((canvas) => {
        return canvas.toDataURL('png')
      })
      return image
    } else {
      return ''
    }
  }

  const exportPdf = async () => {
    sendIsLoading(true)
    const blob = await pdf((
      MyDocument()
    )).toBlob()
    saveAs(blob, 'AiGA_PDF_' + (abnormalRange ? 'Clnician' : 'Researcher') + '_' + history?.id + '.pdf')
    sendIsLoading(false)
  }

  return (
    <div id="exportPdf">
      <button className="btn btn-primary export-pdf" type="button" onClick={exportPdf} disabled={disable}>Export PDF</button>
    </div>
  )
}
export default ExportPdf