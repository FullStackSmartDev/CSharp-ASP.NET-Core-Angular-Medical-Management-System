import { StringHelper } from "../helpers/stringHelper";
import { SelectabelItemsConfiguration } from "./selectabelItemsConfiguration";

export class RtxConfiguration {
    private static uiColor: string = "#dde0ee";
    private static toolbarGroups = [
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'align'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] }
    ]
    private static removeButtons = "Underline,Subscript,Superscript,SpecialChar,Source,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe"

    static get default(): any {
        return {
            uiColor: RtxConfiguration.uiColor,
            extraPlugins: "divarea",
            toolbarGroups: this.toolbarGroups,
            removeButtons: this.removeButtons
        }
    }

    static get selectableItem(): any {
        return {
            extraAllowedContent: StringHelper
                .format(
                    "span;span[{0}];span[id];span[{1}]",
                    SelectabelItemsConfiguration.selectableDataAttrName
                ),
            uiColor: RtxConfiguration.uiColor,
            extraPlugins: "divarea",
            toolbarGroups: this.toolbarGroups,
            removeButtons: this.removeButtons
        }
    }
}