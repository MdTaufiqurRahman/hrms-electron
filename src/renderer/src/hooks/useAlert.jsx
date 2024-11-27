import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useAlert = () => {
    const showAlert = ({
        type = "info",
        title = "Alert",
        text = "",
    }) => {
        MySwal.fire({
            icon: type,
            title,
            text,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            willOpen: () => {
                const swalContainer = Swal.getPopup();
                swalContainer.addEventListener("mouseenter", Swal.stopTimer);
                swalContainer.addEventListener("mouseleave", Swal.resumeTimer);
            },
            didClose: () => {
                const swalContainer = Swal.getPopup();
                if (swalContainer) {
                    swalContainer.removeEventListener("mouseenter", Swal.stopTimer);
                    swalContainer.removeEventListener("mouseleave", Swal.resumeTimer);
                }
            },
        });
    };

    return { showAlert };
};