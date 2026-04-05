import ColoringCanvas from "@/components/coloring-canvas";

export default function ColoringArtworkPage(props) {
  return <ColoringCanvas artworkId={props.params.id} />;
}
